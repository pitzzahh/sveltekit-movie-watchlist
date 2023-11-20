<script lang="ts">
	import { host, movieFormInfo, store } from '$lib';
	import * as Form from '$lib/components/ui/form';
	import { addSchema } from './schema';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { scale } from 'svelte/transition';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormSchema } from './schema';
	export let errMsg: string = '';
	export let form: SuperValidated<FormSchema>;
	export let isValid: boolean | undefined = undefined;

	$: {
		if (isValid) {
			toast.success(`Movie ${form.data.title} is now in the watch list`);
			goto('/');
		}

		if (isValid != undefined && !isValid) {
			toast.error(`Failed to add movie: ${errMsg}`);
		}
	}

	$: {
		store.subscribe((state) => {
			if(state.isProcessing) {
				toast.loading(`Adding Movie ${form.data.title}`)
			}
		})
	}
</script>

<div in:scale>
	<div class="flex flex-col items-center md:items-left mb-5">
		<p class="text-2xl font-bold">Add Movie</p>
		<p class="text-xl font-semi-bold">Add a movie to your watch list</p>
	</div>

	<Form.Root class="mx-5" method="POST" {form} schema={addSchema} let:config>
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
						{#each Array.from({ length: 10 }, (_, index) => index + 1) as option (option)}
							<Form.SelectItem value={option.toString()}>{option}</Form.SelectItem>
						{/each}
					</Form.SelectContent>
				</Form.Select>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Button
			class="mt-2"
			formaction="?/addMovie">{`Add to watch list`}</Form.Button
		>
	</Form.Root>
</div>
