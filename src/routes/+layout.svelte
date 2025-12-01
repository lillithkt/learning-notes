<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Lillith's Learning Notes</title>
	<meta name="darkreader-lock">
</svelte:head>

<div class="min-h-screen bg-stone-50 dark:bg-stone-900">
	{@render children()}
</div>
