<script lang="ts">
	import { pagesByCategory, allPages, type Page } from '$lib/pages';
	import { Search } from '$lib/components';
	import { page } from '$app/state';
	
	// Helper function to get the most recent edit date for a page
	function getLatestEditDate(page: Page): string {
		return page.metadata.editedAt[page.metadata.editedAt.length - 1];
	}
	
	// Helper function to find the newest article in a category
	function getNewestArticle(categoryPages: Page[]): Page | null {
		if (categoryPages.length === 0) return null;
		return categoryPages.reduce((newest, current) => {
			const newestDate = new Date(getLatestEditDate(newest));
			const currentDate = new Date(getLatestEditDate(current));
			return currentDate > newestDate ? current : newest;
		});
	}
	
	const siteUrl = $derived(page.url.origin);
	const pageUrl = $derived(page.url.href);
	const description = 'my notes from learning different programming languages';
</script>

<svelte:head>
	<title>Lillith's Learning Notes</title>
	<meta name="description" content={description} />
	<meta property="theme-color" content="#ca9df5">
	<meta property="og:type" content="website" />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:title" content="Lillith's Learning Notes" />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content="Lillith's Learning Notes" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Lillith's Learning Notes" />
	<meta name="twitter:description" content={description} />
</svelte:head>

<div class="max-w-6xl mx-auto px-6 py-12 lg:px-8">
	<div class="text-center mb-12">
		<h1 class="text-5xl font-bold text-stone-900 dark:text-stone-100 mb-4">
			Lillith's Learning Notes
		</h1>
		<p class="text-xl text-stone-600 dark:text-stone-400">
			learning different languages
		</p>
	</div>
	
	<div class="mb-12 max-w-2xl mx-auto">
		<Search />
	</div>
	
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each Object.entries(pagesByCategory) as [category, categoryPages]}
			{@const newestArticle = getNewestArticle(categoryPages)}
			<div class="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-6 shadow-sm hover:shadow-md transition-shadow">
				<h2 class="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4 capitalize">
					{category}
				</h2>
				<ul class="space-y-2">
					{#each categoryPages as page}
						{@const isNewest = newestArticle?.slug === page.slug}
						<li>
							<a
								href="{page.slug}"
								class="block py-1 transition-colors {
									isNewest
										? 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium'
										: 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
								} hover:underline"
							>
								{page.metadata.title}
								{#if isNewest}
									<span class="ml-2 text-xs">✨</span>
								{/if}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
	
	<div class="mt-12 text-center">
		<p class="text-stone-600 dark:text-stone-400">
			Total pages: {allPages.length}
		</p>
	</div>
</div>
