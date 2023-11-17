<script lang="ts">
    import type { PageData } from './$types';

	import MovieForm from './MovieForm.svelte';
    
    export let data: PageData;

    $: console.log(`Page data in movies: ${data}`)
</script>

<MovieForm form={data.form} />