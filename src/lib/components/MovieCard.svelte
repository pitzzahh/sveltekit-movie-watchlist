<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Loader2 } from 'lucide-svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { host, fetchMovies, store } from '$lib';
	export let movie: Movie;

	$: isDeleting = false;
	$: isModifying = false;

	async function deleteMovie(): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				isDeleting = true;
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
				isDeleting = false;
			} catch (error: any) {
				isDeleting = false;
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
		<p class="font-bold">Release Year: <span class="font-normal">{movie.year}</span></p>
		<p class="font-bold">Rating: <span class="font-normal">{movie.rating}</span></p>
		<p class="font-bold">
			Watched: <span class="font-normal">{movie.watched ? 'Yes' : 'No'}</span>
		</p>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<Button
					builders={[builder]}
					class={`${isModifying ? 'cursor-not-allowed' : 'cursor-default'}`}
					on:click={() => {
						isModifying = true;
						goto(`/movie/${movie._id}`).then(() => (isModifying = false));
					}}
				>
					{#if isModifying}
						<Loader2 class="mr-2 animate-spin" />
					{/if}
					Modify</Button
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
					class={`${isDeleting ? 'cursor-not-allowed' : 'cursor-default'}`}
					variant="destructive"
					on:click={() => {
						toast.promise(deleteMovie, {
							loading: `Deleting ${movie.title}`,
							success: (data) => {
								$store.movies = fetchMovies();
								return data.name;
							},
							error: (err) => {
								return `${err}`;
							}
						});
					}}
				>
					{#if isDeleting}
						<Loader2 class="mr-2 animate-spin" />
					{/if}
					Delete</Button
				>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>{`Delete movie ${movie.title}`}</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</Card.Footer>
</Card.Root>
