<script lang="ts">
	import { movieFormInfo, store, suggestGenre } from '$lib';
	import * as Form from '$lib/components/ui/form';
	import { formSchema, type FormSchema } from './schema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Label } from '$lib/components/ui/label';
	import { goto } from '$app/navigation';
	import { scale } from 'svelte/transition';

	export let form: SuperValidated<FormSchema>;
</script>

<div class="mx-5" in:scale>
	<div class="flex flex-col items-center md:items-left mb-5">
		<Label class="text-2xl font-bold">Add Movie</Label>
		<Label class="text-xl font-semi-bold">Add a movie to your watch list.</Label>
	</div>

	<Form.Root {form} schema={formSchema} let:config method="POST">
		{#each movieFormInfo as movieInfo}
			<Form.Field {config} name={movieInfo.name}>
				<Form.Item>
					<Form.Label class="font-bold">{movieInfo.label}</Form.Label>
					{#if movieInfo.name === 'rating'}
						<Form.Select>
							<Form.SelectTrigger placeholder="Select the {movieInfo.name} of the movie" />
							<Form.SelectContent class="overflow-y-auto h-40">
								{#each Array.from({ length: 10 }, (_, index) => index + 1) as option (option)}
									<Form.SelectItem value={option.toString()}>{option}</Form.SelectItem>
								{/each}
							</Form.SelectContent>
						</Form.Select>
					{:else}
						<Form.Input placeholder={movieInfo.description} />
					{/if}
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		{/each}
		<Form.Button
			class="mt-2"
			formaction="?/createMovie"
			on:click={() => {
				if (form && form.valid) {
					goto('/');
				}
			}}>Add to watch list</Form.Button
		>
	</Form.Root>
</div>
