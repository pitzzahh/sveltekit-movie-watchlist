<script lang="ts">
    import type { PageData } from './$types';

	import MovieForm from './MovieForm.svelte';
    
    export let data: PageData;
</script>

<MovieForm form={data.form} />