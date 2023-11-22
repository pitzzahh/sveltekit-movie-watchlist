<script lang="ts">
	import MovieForm from '$lib/components/MovieForm.svelte';
	import type { PageData, ActionData } from './$types';
	export let data: PageData;
	export let form: ActionData;
</script>

<MovieForm 
	movie={data.movie}
	form={data.form} 
	isValid={form?.valid} 
	errMsg={form?.errorMessage} 
	isModifying={true}
	message={form?.message}
/>