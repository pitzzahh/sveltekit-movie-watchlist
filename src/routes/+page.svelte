<script lang="ts">
	import MovieCard from '../lib/components/MovieCard.svelte';
	import Error from '../lib/components/Error.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Film } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { fade } from 'svelte/transition';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { host, store } from '$lib';
	import type { PageData } from './$types';

	export let pageTitle = 'SvelteKit x MongoDB x shadcn-svelte Movie Watch List';
	export let pageDescription =
		'SvelteKit-powered Movie Watchlist: Easily track, rate, and organize your movie choices with this user-friendly app. ';
	export let pageUrl = host;
	export let data: PageData;

	onMount(() => {
		store.update((state) => ({
			...state,
			movies: data.streamed.movies
		}));
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta name="author" content="Peter John Arao" />
	<meta name="keywords" content="SvelteKit Movie watchlist, movie watch list" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="{pageUrl}/" />
	<meta http-equiv="Content-Language" content="en" />
	<meta name="format-detection" content="telephone=no" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content="{pageUrl}/" />
	<meta property="og:image" content="thumbnail.png" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={pageTitle} />
</svelte:head>

<div in:fade>
	{#await $store.movies}
		<div class="grid place-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 m-4">
			{#each Array.from({ length: 6 }, (_, index) => index + 1) as option (option)}
				<Card.Root class="w-full">
					<Card.Header>
						<Skeleton class="h-5 w-3/4 mb-2 bg-gray-300 rounded" />
						<div class="flex overflow-y-auto scrollbar-hide gap-1">
							{#each Array.from({ length: 5 }, (_, index) => index + 1) as option (option)}
								<Skeleton class="h-5 w-14 bg-gray-300 rounded-lg" />
							{/each}
						</div>
					</Card.Header>
					<Card.Content>
						<Skeleton class="h-4 w-1/4 bg-gray-300 rounded mb-1" />
						<Skeleton class="h-4 w-1/5 bg-gray-300 rounded mb-1" />
						<Skeleton class="h-4 w-1/4 bg-gray-300 rounded mb-1" />
					</Card.Content>
					<Card.Footer class="flex justify-between">
						<Skeleton class="h-10 w-16 bg-gray-300 rounded" />
						<Skeleton class="h-10 w-16 bg-gray-300 rounded" />
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	{:then movies}
		{#if movies.length != undefined && movies.length == 0}
			<div class="m-5">
				<Alert.Root>
					<Film class="h-4 w-4" />
					<Alert.Title>No Movies in your watch list</Alert.Title>
					<Alert.Description
						>You can add movies by clicking Add Movie Button above</Alert.Description
					>
				</Alert.Root>
			</div>
		{:else}
			<div class="grid place-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 m-4">
				{#each movies as movie}
					<MovieCard {movie} />
				{/each}
			</div>
		{/if}
	{:catch}
		<Error {page} />
	{/await}
</div>
