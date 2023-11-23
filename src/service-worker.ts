import { build, files, version } from "$service-worker";

const worker = self as unknown as ServiceWorkerGlobalScope;
const STATIC_CACHE_NAME = `cache${version}`;
const APP_CACHE_NAME = `offline${version}`;

const routes = ["/", "/movie", "/movie/[id]"];

const addDomain = (assets: string[]) =>
  assets.map((f) => self.location.origin + f);

const ourAssets = addDomain([
  ...files.filter((f: string) => !/\/icons\/(apple.*?|original.png)/.test(f)),
  ...build,
  ...routes,
]);

const toCache = [...ourAssets];
const staticAssets = new Set(toCache);

worker.addEventListener("install", (event: { waitUntil: (arg0: Promise<void>) => void; }) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        return cache.addAll(toCache);
      })
      .then(() => {
        worker.skipWaiting();
      })
  );
});

worker.addEventListener("activate", (event: { waitUntil: (arg0: Promise<void>) => void; }) => {
  event.waitUntil(
    caches.keys().then(async (keys) => {
      // delete old caches
      for (const key of keys) {
        if (key !== STATIC_CACHE_NAME && key !== APP_CACHE_NAME) {
          await caches.delete(key);
        }
      }

      worker.clients.claim();
    })
  );
});

/**
 * Fetch the asset from the network and store it in the cache.
 * Fall back to the cache if the user is offline.
 */
async function fetchAndCache(request: Request) {
  const cache = await caches.open(APP_CACHE_NAME);

  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (err) {
    const response = await cache.match(request);
    if (response) {
      return response;
    }

    throw err;
  }
}

worker.addEventListener("fetch", (event: { request: RequestInfo | URL; respondWith: (arg0: Promise<Response>) => void; }) => {
  if (event.request.method !== "GET" || event.request.headers.has("range")) {
    return;
  }

  const url = new URL(event.request.url);

  // don't try to handle e.g. data: URIs
  const isHttp = url.protocol.startsWith("http");
  const isDevServerRequest =
    url.hostname === self.location.hostname && url.port !== self.location.port;
  const isStaticAsset = staticAssets.has(url.href);
  const skipBecauseUncached =
    event.request.cache === "only-if-cached" && !isStaticAsset;

  if (isHttp && !isDevServerRequest && !skipBecauseUncached) {
    event.respondWith(
      (async () => {
        // always serve static files and bundler-generated assets from cache.
        // if your application has other URLs with data that will never change,
        // set this variable to true for them, and they will only be fetched once.
        const cachedAsset =
          isStaticAsset && (await caches.match(event.request));

        return cachedAsset || fetchAndCache(event.request);
      })()
    );
  }
});
