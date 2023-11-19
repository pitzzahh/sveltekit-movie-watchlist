<script lang="ts">
	import '../app.postcss';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Sun, Moon, Clapperboard } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { store } from '$lib';
	import { page } from '$app/stores';
	import { goto, onNavigate } from '$app/navigation';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { setMode, resetMode, ModeWatcher, userPrefersMode } from 'mode-watcher';
	import { Toaster } from 'svelte-sonner';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	onMount(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				goto(`${$page.route.id === '/' ? '/movie' : '/'}`)
			}
		}

		document.addEventListener('keydown', handleKeydown);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	let buttonText = 'Add Movie';

	$: buttonText = $page.route.id != '/' ? 'Home' : 'Add Movie';
</script>

<nav
	class="flex justify-between items-center p-4 sticky top-0 z-10 backdrop-filter backdrop-blur-lg bg-opacity-20"
>
	<div class="flex items-center gap-1">
		<Clapperboard size={32} />
		<a href="/" class="font-bold text-3xl md:text-3xl cursor-pointer">Movie Watchlist</a>
	</div>

	<div class="flex items-center space-x-4">
		<a href={buttonText == 'Home' ? '/' : '/movie'} class={buttonVariants({ variant: 'outline' })}>
			{buttonText} <span class="text-slate-600 ml-2">⌘J</span>
		</a>

		<DropdownMenu.Root positioning={{ placement: 'bottom-end' }}>
			<DropdownMenu.Trigger asChild let:builder>
				<Button builders={[builder]} variant="outline" size="icon">
					<Sun
						class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
					/>
					<Moon
						class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Item on:click={() => setMode('light')}>Light</DropdownMenu.Item>
				<DropdownMenu.Item on:click={() => setMode('dark')}>Dark</DropdownMenu.Item>
				<DropdownMenu.Item on:click={() => resetMode()}>System</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</nav>

<ModeWatcher />

<Toaster richColors position="bottom-right" theme={$userPrefersMode} />

<slot />
