<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { host, fetchMovies, store } from '$lib';
	export let movie: Movie;

	async function deleteMovie(): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				console.log(`Deleting movie with title: ${movie.title}`);
				const response: Response = await fetch(`${host}/api/movies`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ id: movie._id })
				});
				if (response.ok) {
					const res = await response.json();
					resolve({ name: res.message });
				} else {
					const res = await response.json();
					reject(res.errorMessage);
				}
			} catch (error: any) {
				console.error('Error deleting movie');
				reject(error.errorMessage);
			}
		});
	}
</script>

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title class="font-bold text-xl">{movie.title}</Card.Title>
		<div class="flex overflow-y-auto scrollbar-hide gap-1">
			{#each movie.genres as genre}
				<Badge>{genre}</Badge>
			{/each}
		</div>
	</Card.Header>
	<Card.Content>
		<p class="font-bold">Release Year: <span>{movie.year}</span></p>
		<p class="font-bold">Rating: <span>{movie.rating}</span></p>
		<p class="font-bold">Watched: <span>{movie.watched ? 'Yes' : 'No'}</span></p>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<Button
					builders={[builder]}
					on:click={() => {
						console.log(`Movie Id in params: ${movie._id}`);
						goto(`/movie/${movie._id}`);
					}}>Modify</Button
				>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>{`Modify ${movie.title}`}</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<Button
					builders={[builder]}
					variant="destructive"
					on:click={() => {
						toast.promise(deleteMovie, {
							loading: `Deleting ${movie.title}`,
							success: (data) => {
								store.update((state) => ({
									...state,
									movies: fetchMovies()
								}));
								return data.name;
							},
							error: (err) => {
								return `${err}`;
							}
						});
					}}>Delete</Button
				>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>{`Delete movie ${movie.title}`}</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</Card.Footer>
</Card.Root>
