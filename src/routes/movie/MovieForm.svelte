<script lang="ts">
	import { movieFormInfo } from '$lib';
	import * as Form from '$lib/components/ui/form';
	import { formSchema, type FormSchema } from './schema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { scale } from 'svelte/transition';

	export let form: SuperValidated<FormSchema>;
	export let isValid: boolean = false;
	export let insertedData: any;

	$: {
		if (isValid) {
			toast.success(`Movie ${JSON.parse(insertedData).title} is now in the watch list`);
			goto('/');
		}
	}
</script>

<div in:scale>
	<div class="flex flex-col items-center md:items-left mb-5">
		<p class="text-2xl font-bold">Add Movie</p>
		<p class="text-xl font-semi-bold">Add a movie to your watch list.</p>
	</div>

	<Form.Root class="mx-5" method="POST" {form} schema={formSchema} let:config>
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
					<Form.SelectContent class="overflow-y-auto h-40">
						{#each Array.from({ length: 10 }, (_, index) => index + 1) as option (option)}
							<Form.SelectItem value={option.toString()}>{option}</Form.SelectItem>
						{/each}
					</Form.SelectContent>
				</Form.Select>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Button class="mt-2">Add to watch list</Form.Button>
	</Form.Root>
</div>
