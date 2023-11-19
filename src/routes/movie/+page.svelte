<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import MovieForm from '../../lib/components/MovieForm.svelte';
	export let data: PageData;
	export let form: ActionData;
</script>

<MovieForm 
	form={data.form} 
	isValid={form?.valid} 
	movie={form?.insertedData} 
	errMsg={form?.errorMessage} 
/>