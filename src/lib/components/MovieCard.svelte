<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	export let movie: Movie;
</script>

<form method="POST" class="w-full" use:enhance>
	<Card.Root class="w-full">
		<input class="sr-only" bind:value={movie._id} name="movieId" />
		<Card.Header>
			<Card.Title class="font-bold text-xl">{movie.title}</Card.Title>
			<div class="flex overflow-y-auto scrollbar-hide gap-1">
				{#each movie.genres as genre}
					<Card.Description><Badge>{genre}</Badge></Card.Description>
				{/each}
			</div>
		</Card.Header>
		<Card.Content>
			<p class="font-bold">Release Year: <span>{movie.year}</span></p>
			<p class="font-bold">Rating: <span>{movie.rating}</span></p>
			<p class="font-bold">Watched: <span>{movie.watched ? 'Yes' : 'No'}</span></p>
		</Card.Content>
		<Card.Footer class="flex justify-between">
			<Button
				on:click={() => {
					console.log(`Movie Id in params: ${movie._id}`);
					goto(`/movie/${movie._id}`);
				}}>Modify</Button
			>
			<Form.Button variant="destructive" formaction="?/deleteMovie">Delete</Form.Button>
		</Card.Footer>
	</Card.Root>
</form>
