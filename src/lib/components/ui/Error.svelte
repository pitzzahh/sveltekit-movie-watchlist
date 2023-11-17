<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import type { Page } from '@sveltejs/kit';
	import { XCircle } from 'lucide-svelte';
	import type { Readable } from 'svelte/motion';
	export let page: Readable<Page<Record<string, string>, string | null>>
</script>

<Alert.Root variant="destructive">
	<XCircle class="h-4 w-4" />
	<Alert.Title class="font-bold">Heads up!</Alert.Title>
	<Alert.Description class="text-center">
		{$page.status}: {$page.error?.message}
	</Alert.Description>
</Alert.Root>

