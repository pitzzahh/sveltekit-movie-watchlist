<script lang="ts">
	import { movieFormInfo, suggestGenre } from '$lib';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { onMount } from 'svelte';
	import { formSchema, type FormSchema } from './schema';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let form: SuperValidated<FormSchema>;

	const movie = {
		title: '',
		genre: ''
	};

	onMount(async () => {
		const suggestedGenre = await suggestGenre('hor');
		console.log(suggestedGenre)
	});
</script>

<Form.Root method="POST" {form} schema={formSchema} let:config >
	{#each movieFormInfo as movieInfo}
		<Form.Field {config} name={movieInfo.name} >
			<Form.Item >
				<Form.Label>{movieInfo.label}</Form.Label>
				<Form.Input />
				<Form.Description>{movieInfo.description}</Form.Description>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	{/each}

	<Form.Button>Submit</Form.Button>
</Form.Root>
