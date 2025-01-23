<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';

	onMount(() => {
		//if ('serviceWorker' in navigator) {
		//	navigator.serviceWorker.register('/service-worker.js', {
		//		type: 'module'
		//	});
		//}
	})
	
	let { children } = $props();
</script>

{@render children()}
