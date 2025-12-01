<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Lillith's Learning Notes</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	{@render children()}
</div>
