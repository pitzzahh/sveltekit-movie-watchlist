<script lang="ts">
	import '../app.postcss';
	import type { PageData } from './$types';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Sun, Moon } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	import { setMode, toggleMode } from 'mode-watcher';
	import MovieForm from './movie/MovieForm.svelte';
	import { onMount } from 'svelte';

    onMount(() => setMode('system'));
	setMode('system')
	export let data: PageData;
</script>

<nav class="flex justify-between items-center p-4">
	<Dialog.Root>
		<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Add Movie</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Add Movie</Dialog.Title>
				<Dialog.Description>Add a movie to your watch list.</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<MovieForm form={data.form} />
			</div>
		</Dialog.Content>
	</Dialog.Root>

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
