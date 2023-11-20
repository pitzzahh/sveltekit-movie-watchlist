<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import UpdateMovieForm from './UpdateMovieForm.svelte';
	export let data: PageData;
	export let form: ActionData;
</script>

<UpdateMovieForm
	movie={data.movie}
	form={data.form}
	isValid={form?.valid}
	errMsg={form?.errorMessage}
/>
