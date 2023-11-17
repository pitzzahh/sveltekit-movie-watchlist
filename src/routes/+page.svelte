<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Film } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let data: PageData;

	// server side rendered, auto fetch
	$: ({ movies } = data);
</script>

<div in:scale>
	{#if data.status === 404}
		<Alert.Root>
			<Film class="h-4 w-4" />
			<Alert.Title>No Movies in your watch list</Alert.Title>
			<Alert.Description>You can add movies by clicking Add Movie Button above</Alert.Description>
		</Alert.Root>
	{:else}
		<div class="grid place-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 m-4">
			{#each movies as movie}
				<form
					transition:fly={{
						delay: 250,
						duration: 300,
						x: 100,
						y: 500,
						opacity: 0.5,
						easing: quintOut
					}}
					method="post"
					class="w-full"
					action="?/deleteMovie"
				>
					<Card.Root class="w-full">
						<input class="sr-only" name={movie.id} />
						<Card.Header>
							<Card.Title class="font-bold text-xl">{movie.title}</Card.Title>
							<div class="flex gap-1">
								{#each movie.genres as genre}
									<Card.Description><Badge>{genre.name}</Badge></Card.Description>
								{/each}
							</div>
						</Card.Header>
						<Card.Content>
							<p class="font-bold">Release Year: <span>{movie.year}</span></p>
							<p class="font-bold">Rating: <span>{movie.rating}</span></p>
							<p class="font-bold">Watched: <span>{movie.watched ? 'Yes' : 'No'}</span></p>
						</Card.Content>
						<Card.Footer class="flex justify-between">
							<Button variant="destructive" formaction="?/deleteMovie">Delete</Button>
							<Button>Modify</Button>
						</Card.Footer>
					</Card.Root>
				</form>
			{/each}
		</div>
	{/if}
</div>
