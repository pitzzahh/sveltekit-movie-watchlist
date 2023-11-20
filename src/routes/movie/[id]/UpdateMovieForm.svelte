<script lang="ts">
	import { movieFormInfo } from '$lib';
	import * as Form from '$lib/components/ui/form';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { scale } from 'svelte/transition';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { updateSchema, type FormSchema } from './schema';
	export let errMsg: string = '';
	export let movie: Movie;
	export let form: SuperValidated<FormSchema>;
	export let isValid: boolean | undefined = undefined;

	$: {
		console.log(`MOVIE: ${JSON.stringify(movie)}`);
		if (isValid) {
			toast.success(
				`Movie ${movie?.title} updated successfully'`
			);
			goto('/');
		}

		if (isValid != undefined && !isValid) {
			toast.error(`Failed to update movie: ${errMsg}`);
		}
	}
</script>

<div in:scale>
	<div class="flex flex-col items-center md:items-left mb-5">
		<p class="text-2xl font-bold">Update Movie</p>
		<p class="text-xl font-semi-bold">{`Update Movie ${movie.title}`}</p>
	</div>

	<Form.Root class="mx-5" method="POST" {form} schema={updateSchema} let:config>
		<Form.Field {config} name="title">
			<Form.Item>
				<Form.Label class="font-bold">Title</Form.Label>
									<Form.Input placeholder={movieFormInfo[0].description} value={movie.title} />


				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="genres">
			<Form.Item>
				<Form.Label>Genres</Form.Label>
									<Form.Input placeholder={movieFormInfo[1].description} value={movie.genres.join(' ')} />

				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="year">
			<Form.Item>
				<Form.Label>Year of release</Form.Label>
									<Form.Input placeholder={movieFormInfo[2].description} value={movie.year} />

				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="rating">
			<Form.Item>
				<Form.Label class="font-bold">Rating</Form.Label>
				<Form.Select>
					<Form.SelectTrigger placeholder={movieFormInfo[3].description} />
					<Form.SelectContent class="overflow-y-auto scrollbar-hide h-40">
						{#each Array.from({ length: 10 }, (_, index) => index + 1) as option (option)}
						<Form.SelectItem value={movie.rating.toString()}>{option}</Form.SelectItem>
						{/each}
					</Form.SelectContent>
				</Form.Select>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Button class="mt-2">{`Update movie ${movie.title}`}</Form.Button>
	</Form.Root>
</div>
