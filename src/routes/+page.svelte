<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Film } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { store } from '$lib';
	import type { FormSchema } from './movie/schema';

	export let form: SuperValidated<FormSchema>;
	export let data: PageData;

	// server side rendered, auto fetch
	$: ({ movies } = data);

	$: {
		if (form && form.valid) {
			store.update((state) => ({
				...state,
				openForm: !form.valid
			}));
		}
	}
</script>

{#if data.status === 200}
	<div class="grid place-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 m-4">
		{#each movies as movie}
			<Card.Root class="w-full">
				<input class="sr-only" name={movie.id} />
				<Card.Header>
					<Card.Title>{movie.title}</Card.Title>
					<Card.Description><Badge>{movie.genre}</Badge></Card.Description>
				</Card.Header>
				<Card.Content>
					<p>Release Year: {movie.year}</p>
					<p>Rating: {movie.rating}</p>
					<p>Watched: {movie.watched ? 'Yes' : 'No'}</p>
				</Card.Content>
				<Card.Footer class="flex justify-between">
					<Button variant="destructive">Delete</Button>
					<Button>Modify</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
{:else}
	<Alert.Root>
		<Film class="h-4 w-4" />
		<Alert.Title>No Movies in your watch list</Alert.Title>
		<Alert.Description>You can add movies by clicking Add Movie Button above</Alert.Description>
	</Alert.Root>
{/if}
