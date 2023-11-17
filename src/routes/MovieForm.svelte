<script lang="ts">
	import { movieFormInfo, store, suggestGenre } from '$lib';
	import * as Form from '$lib/components/ui/form';
	import { onMount } from 'svelte';
	import { formSchema, type FormSchema } from './movie/schema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ActionData } from './$types';

	export let form: SuperValidated<FormSchema>;

	onMount(async () => {
		const suggestedGenre = await suggestGenre('hor');
		console.log(suggestedGenre);
	});
</script>

<Form.Root {form} schema={formSchema} let:config method="POST" action="?/createMovie">
	{#each movieFormInfo as movieInfo}
		<Form.Field {config} name={movieInfo.name}>
			<Form.Item>
				<Form.Label class="font-bold">{movieInfo.label}</Form.Label>
				{#if movieInfo.name === 'rating'}
					<Form.Select>
						<Form.SelectTrigger placeholder="Select the {movieInfo.name} of the movie" />
						<Form.SelectContent class="overflow-y-auto h-32">
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
	<Form.Button class="mt-2">Add to watch list</Form.Button
	>
</Form.Root>
