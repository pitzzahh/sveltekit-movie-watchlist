<script lang="ts">
	import { movieFormInfo } from '$lib';
	import * as Form from '$lib/components/ui/form';
	import { updateSchema, type FormSchema } from '../../routes/movie/schema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { scale } from 'svelte/transition';
	export let errMsg: string = '';
	export let movie: Movie | undefined;
	export let heading: string = 'Add Movie';
	export let subHeading: string = 'Add a movie to your watch list';
	export let form: SuperValidated<FormSchema>;
	export let isValid: boolean | undefined = undefined;
	export let isModifying: boolean = false;

	$: {
		console.log(`MOVIE: ${JSON.stringify(movie)}`);

		if (isValid) {
			toast.success(
				`Movie ${movie?.title} ${isModifying ? 'updated successfully' : 'is now in the watch list'}`
			);
			goto('/');
		}

		console.log(`Errors: ${JSON.stringify(form.errors._errors)}`);
		if (errMsg) {
			toast.error(`Failed to ${isModifying ? 'update' : 'add'} movie\n${errMsg}`);
		}
	}
</script>

<div in:scale>
	<div class="flex flex-col items-center md:items-left mb-5">
		<p class="text-2xl font-bold">{heading}</p>
		<p class="text-xl font-semi-bold">{subHeading}</p>
	</div>

	<Form.Root class="mx-5" method="POST" {form} schema={updateSchema} let:config>
		<Form.Field {config} name="title">
			<Form.Item>
				<Form.Label class="font-bold">Title</Form.Label>
				{#if isModifying && movie}
					<Form.Input placeholder={movieFormInfo[0].description} value={movie.title} />
				{:else}
					<Form.Input placeholder={movieFormInfo[0].description} />
				{/if}

				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="genres">
			<Form.Item>
				<Form.Label>Genres</Form.Label>
				{#if isModifying && movie && movie.genres}
					<Form.Input placeholder={movieFormInfo[1].description} value={movie.genres.join(' ')} />
				{:else}
					<Form.Input placeholder={movieFormInfo[1].description} />
				{/if}
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="year">
			<Form.Item>
				<Form.Label>Year of release</Form.Label>
				{#if isModifying && movie}
					<Form.Input placeholder={movieFormInfo[2].description} value={movie.year} />
				{:else}
					<Form.Input placeholder={movieFormInfo[2].description} />
				{/if}
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
							{#if isModifying && movie}
								<Form.SelectItem value={movie.rating.toString()}>{option}</Form.SelectItem>
							{:else}
								<Form.SelectItem value={option.toString()}>{option}</Form.SelectItem>
							{/if}
						{/each}
					</Form.SelectContent>
				</Form.Select>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Button class="mt-2" formaction="?/updateMovie"
			>{isModifying ? 'Update movie' : 'Add to watch list'}</Form.Button
		>
	</Form.Root>
</div>
