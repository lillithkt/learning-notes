<script lang="ts">
	import { allPages, pagesByCategory, type Page } from '$lib/pages';
	
	let searchQuery = $state('');
	let selectedCategory = $state<string>('all');
	
	const categories = $derived(['all', ...Object.keys(pagesByCategory).sort()]);
	
	const filteredPages = $derived.by(() => {
		let pagesToSearch: Page[] = selectedCategory === 'all' 
			? allPages 
			: pagesByCategory[selectedCategory] || [];
		
		if (!searchQuery.trim()) {
			return [];
		}
		
		const query = searchQuery.toLowerCase();
		return pagesToSearch.filter(page => {
			const titleMatch = page.metadata.title.toLowerCase().includes(query);
			const descMatch = page.metadata.description?.toLowerCase().includes(query) || false;
			const contentMatch = page.rawContent.toLowerCase().includes(query);
			return titleMatch || descMatch || contentMatch;
		});
	});
	
	function clearSearch() {
		searchQuery = '';
	}
</script>

<div class="search-container">
	<div class="flex flex-col gap-2">
		<select 
			bind:value={selectedCategory}
			class="px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
			{#each categories as category}
				<option value={category}>
					{category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
				</option>
			{/each}
		</select>
		
		<div class="relative">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search notes..."
				class="w-full px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			{#if searchQuery.trim()}
				<button
					onclick={clearSearch}
					class="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
					aria-label="Clear search"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
					</svg>
				</button>
			{/if}
		</div>
	</div>
	
	{#if searchQuery.trim()}
		<div class="mt-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-4 max-h-96 overflow-y-auto shadow-lg">
			{#if filteredPages.length === 0}
				<p class="text-sm text-stone-500 dark:text-stone-400 text-center py-4">
					No results found for "{searchQuery}"
				</p>
			{:else}
				<div class="flex items-center justify-between mb-3">
					<p class="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
						{filteredPages.length} result{filteredPages.length !== 1 ? 's' : ''}
					</p>
					{#if selectedCategory !== 'all'}
						<span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded capitalize">
							{selectedCategory}
						</span>
					{/if}
				</div>
				<ul class="space-y-1">
					{#each filteredPages as page}
						<li>
							<a
								href={page.slug}
								class="block px-3 py-2 rounded-md text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
							>
								<div class="font-medium">{page.metadata.title}</div>
								{#if page.metadata.description}
									<div class="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-1">
										{page.metadata.description}
									</div>
								{/if}
								<div class="text-xs text-stone-400 dark:text-stone-500 mt-1 capitalize">
									{page.category}
								</div>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}
</div>

<style>
	.search-container {
		position: relative;
	}
</style>

