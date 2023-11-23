import { build, files, prerendered, version } from '$service-worker'

const worker = self
const FILES = `cache-${version}`

const toCache = [...build, ...files, ...prerendered]
const staticAssets = new Set(toCache)

// On installation cache all files to the new cache
worker.addEventListener("install", event => {
    event.waitUntil(
	caches.open(FILES)
	      .then(cache => cache.addAll(toCache))
	      .then(() => worker.skipWaiting())
    )
})

// On activation delete all older caches
worker.addEventListener("activate", event => {
    event.waitUntil( 
	caches.keys().then(async (keys) => {
	    for (const key of keys)
		if (key !== FILES)
		    await caches.delete(key)
	})
    )
})

async function fetchAndCache(request) {
    const cache = await caches.open(FILES)

    try {
	const response = await fetch(request)
	cache.put(request, response.clone())
	return response;
    } catch (err) {
	const response = await cache.match(request);
	if (response)
	    return response
	throw err
    }
}

worker.addEventListener("fetch", event => {
    // Cache only GET requests
    if (event.request.method !== "GET" || event.request.headers.has("range"))
	return

    const url = new URL(event.request.url)
    const isHttp = url.protocol.startsWith("http")
    const isDevServerRequest = url.hostname === self.location.hostname && url.port !== self.location.port
    const isStaticAsset = url.host === self.location.host && staticAssets.has(url.pathname)
    const skipBecauseUncached = event.request.cache === "only-if-cached" && !isStaticAsset
    
	// Clean the urls from query string and fragments
	// Otherwise we won't have the exact pages in memory
	url.search = ""
	url.fragment = ""
	const cleanRequest = new Request(url)
	
    if (isHttp && !isDevServerRequest && !skipBecauseUncached)
	event.respondWith(
	    (isStaticAsset && caches.match(cleanRequest)) || fetchAndCache(cleanRequest)
	)
})