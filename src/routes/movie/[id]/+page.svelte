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
	heading="Update Movie"
	subHeading="Update your movie"
	isModifying={true}
/>
