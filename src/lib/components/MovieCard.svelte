<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { deleteSchema, type FormSchema } from '../../routes/schema';
	import type { SuperValidated } from 'sveltekit-superforms';
	export let movie: Movie;
	export let form: SuperValidated<FormSchema>;
</script>

<Form.Root schema={deleteSchema} method="POST" {form} let:config class="w-full">
	<Card.Root class="w-full">
		<Form.Field {config} name="movieId">
			<Form.Item>
				<Form.Input class="sr-only" bind:value={movie._id} />
			</Form.Item>
		</Form.Field>
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
					goto(`/movie/${movie._id}`);
				}}>Modify</Button
			>
			<Form.Button variant="destructive" formaction="?/deleteMovie">Delete</Form.Button>
		</Card.Footer>
	</Card.Root>
</Form.Root>
