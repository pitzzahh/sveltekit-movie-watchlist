<script lang="ts">
	import { movieFormInfo, store } from '$lib';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Form from '$lib/components/ui/form';
	import { toast } from 'svelte-sonner';
	import { scale } from 'svelte/transition';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { goto } from '$app/navigation';
	import { modifySchema } from '../../routes/movie/[id]/schema';
	import { addSchema } from '../../routes/movie/schema';
	export let isModifying: boolean = false;
	export let movie: Movie | undefined;
	export let form: SuperValidated<any>;
	export let errMsg: string = '';
	export let isValid: boolean | undefined = undefined;

	$: {
		if (isValid) {
			toast.success(isModifying ? `Movie is now updated` : `Movie added to watch list`);
			goto('/');
		}
		if (isValid != undefined && !isValid) {
			toast.error(
				isModifying ? `Failed to update movie: ${errMsg}` : `Failed to add movie: ${errMsg}`
			);
		}
	}
</script>

<div in:scale>
	<div class="flex flex-col items-center md:items-left mb-5">
		<p class="text-2xl font-bold">{isModifying ? 'Update Movie' : 'Add Movie'}</p>
		<p class="text-xl font-semi-bold">
			{isModifying ? `Update Movie ${movie?.title}` : 'Add movie to watch list'}
		</p>
	</div>

	<Form.Root
		class="mx-5"
		method="POST"
		{form}
		schema={isModifying ? modifySchema : addSchema}
		let:config
	>
		<Form.Field {config} name="title">
			<Form.Item>
				<Form.Label class="font-bold">Title</Form.Label>
				<Form.Input placeholder={movieFormInfo[0].description} />

				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="genres">
			<Form.Item>
				<Form.Label>Genres</Form.Label>
				<Form.Input placeholder={movieFormInfo[1].description} />

				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="year">
			<Form.Item>
				<Form.Label>Year of release</Form.Label>
				<Form.Input placeholder={movieFormInfo[2].description} />

				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="rating">
			<Form.Item>
				<Form.Label class="font-bold">Rating</Form.Label>
				<Form.Select>
					<Form.SelectTrigger placeholder={movieFormInfo[3].description} />
					<Form.SelectContent class="overflow-y-auto scrollbar-hide h-40">
						{#each Array.from({ length: 20 }, (_, index) => (index + 1) * 0.5) as option (option)}
							<Form.SelectItem value={option.toString()}>{option}</Form.SelectItem>
						{/each}
					</Form.SelectContent>
				</Form.Select>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<Form.Button
					builders={[builder]}
					class="mt-2"
					formaction={isModifying ? '?/modifyMovie' : '?/addMovie'}
					>{isModifying ? `Update movie ${movie?.title}` : `Add movie ${movie?.title}`}</Form.Button
				>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>{isModifying ? 'Update movie' : 'Add movie'}</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</Form.Root>
</div>