<script lang="ts">
	import { movieFormInfo, suggestGenre } from '$lib';
	import * as Form from '$lib/components/ui/form';
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
		console.log(suggestedGenre);
	});
</script>

<Form.Root
	{form}
	schema={formSchema}
	let:config
	method="POST"
>
	{#each movieFormInfo as movieInfo}
		<Form.Field {config} name={movieInfo.name}>
			<Form.Item>
				<Form.Label>{movieInfo.label}</Form.Label>
				{#if movieInfo.name === 'rating'}
					<Form.Select>
						<Form.SelectTrigger placeholder="Select the rating of the movie, or rate it yourself" />
						<Form.SelectContent class="overflow-y-auto">
							{#each Array.from({ length: 10 }, (_, index) => index + 1) as option (option)}
								<Form.SelectItem value={option.toString()}>{option}</Form.SelectItem>
							{/each}
						</Form.SelectContent>
					</Form.Select>
				{:else}
					<Form.Input />
				{/if}
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	{/each}
	<Form.Button>Submit</Form.Button>
</Form.Root>
