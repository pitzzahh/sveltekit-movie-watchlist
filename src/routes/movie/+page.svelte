<script lang="ts">
    import type { PageData, ActionData } from './$types';
	import { scale } from 'svelte/transition';
	import MovieForm from './MovieForm.svelte';
    export let data: PageData;
    export let form: ActionData
</script>

<MovieForm form={data.form} isValid={form?.valid} insertedData={form?.insertedData} />