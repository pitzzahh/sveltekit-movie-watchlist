<script lang="ts">
	import MovieCard from '../lib/components/MovieCard.svelte';
	import type { ActionData, PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Film } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { fade } from 'svelte/transition';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	export let data: PageData;
	export let form: ActionData;

	// server side rendered, auto fetch
	$: ({ movies } = data);

	$: {
		if (form?.valid) {
			toast.success(`Movie ${form?.message} deleted sucessfully`);
		} 
		console.log(`Is valid undefined: ${form?.valid}`)
		if(form?.valid != undefined && !form?.valid) {
			toast.error(`Failed to delete movie ${form?.errorMessage}`);
		}
	}
</script>

<div in:fade>
	{#await movies}
		<Card.Root class="w-full">
			<Card.Header>
				<Skeleton class="h-8 w-2/3 mb-2 bg-gray-300 rounded" />
				<Skeleton class="h-4 w-1/3 bg-gray-300 rounded" />
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
	{:then movies}
		{#if movies.length == 0}
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
	{/await}
</div>
