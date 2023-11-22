<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import MovieForm from '$lib/components/MovieForm.svelte';
	export let data: PageData;
	export let form: ActionData;
</script>

<MovieForm 
	movie={form?.movie}
	form={data.form} 
	isValid={form?.valid} 
	errMsg={form?.errorMessage}
	message={form?.message}
/>
