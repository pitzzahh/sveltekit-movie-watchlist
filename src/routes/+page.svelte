<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Film } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
	export let data: PageData;

	$: ({ movies } = data);
</script>

{#if data.status === 200}
	{#each movies as movie (movie.id)}
		<Card.Root class="w-[350px]">
			<Card.Header>
				<Card.Title>{movie.title}</Card.Title>
				<Card.Description>{movie.genre.join(', ')}</Card.Description>
			</Card.Header>
			<Card.Content>
				<p>Release Year: {movie.releaseYear}</p>
				<p>Rating: {movie.rating}</p>
				<p>Watched: {movie.watched ? 'Yes' : 'No'}</p>
			</Card.Content>
			<Card.Footer class="flex justify-between">
				<Button variant="outline">Cancel</Button>
				<Button>Deploy</Button>
			</Card.Footer>
		</Card.Root>
	{/each}
{:else}
	<Alert.Root>
		<Film class="h-4 w-4" />
		<Alert.Title>No Movies in your watch list</Alert.Title>
		<Alert.Description>You can add movies by clicking Add Movie Button above</Alert.Description>
	</Alert.Root>
{/if}
