<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import UpdateMovieForm from './UpdateMovieForm.svelte';
	export let data: PageData;
</script>

<UpdateMovieForm
	movie={data.movie}
	form={data.form}
/>
