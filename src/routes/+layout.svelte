<script lang="ts">
	import '../app.postcss';
	import type { PageData, ActionData } from './$types';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Sun, Moon } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	import { setMode, toggleMode } from 'mode-watcher';
	import MovieForm from './MovieForm.svelte';
	import { onMount } from 'svelte';
	import { Label } from '$lib/components/ui/label';
	import { store } from '$lib';

	onMount(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				$store.openForm = !$store.openForm;
			}
		}

		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
	export let data: PageData;
</script>

<nav class="flex justify-between items-center p-4">
	<Dialog.Root bind:open={$store.openForm}>
		<Dialog.Trigger
			on:click={() => ($store.openForm = true)}
			class={buttonVariants({ variant: 'outline' })}>Add Movie</Dialog.Trigger
		>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Add Movie</Dialog.Title>
				<Dialog.Description>Add a movie to your watch list.</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<MovieForm form={data.form}/>
			</div>
		</Dialog.Content>
	</Dialog.Root>

	<Label class="font-bold text-3xl">Movie Watchlist</Label>

	<Button on:click={toggleMode} variant="outline" size="icon">
		<Sun
			class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
		/>
		<Moon
			class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
		/>
		<span class="sr-only">Toggle theme</span>
	</Button>
</nav>
<slot />
