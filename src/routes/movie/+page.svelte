<script lang="ts">
	import type {  PageData, ActionData } from './$types';
	import AddMovieForm from './AddMovieForm.svelte';
	export let data: PageData;
	export let form: ActionData;
</script>

<AddMovieForm
	form={data.form}
	isValid={form?.valid}
	errMsg={form?.errorMessage}
/>