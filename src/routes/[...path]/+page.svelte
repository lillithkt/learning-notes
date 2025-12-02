<script lang="ts">
	import { pagesByCategory } from '$lib/pages';
	import { Search } from '$lib/components';
	import { page } from '$app/state';
    import { pages } from '$lib/pages';
	import { getDocsUrl, getCommitUrl } from '$lib/github';

	const currentPath = $derived(page.url.pathname);
    const slug = $derived("/" + page.params.path);
    const pageDef = $derived(pages.get(slug)!)
    const PageComponent = $derived(pageDef.content)
    const metadata = $derived(pageDef.metadata)
	
	// First editedAt is the creation date
	const createdAt = $derived(metadata.editedAt[0])
	// Subsequent edits are actual edits
	const edits = $derived(metadata.editedAt.slice(1))
	
	// OpenGraph data
	const siteUrl = $derived(page.url.origin);
	const pageUrl = $derived(page.url.href);
	const ogTitle = $derived(`${metadata.title} | Lillith's Learning Notes`);
	const ogDescription = $derived(metadata.description || `i didnt put a description lol`);
	const publishedTime = $derived(createdAt);
	const modifiedTime = $derived(metadata.editedAt[metadata.editedAt.length - 1]);
	
	// Helper function to get the most recent edit date for a page
	function getLatestEditDate(page: typeof pageDef): string {
		return page.metadata.editedAt[page.metadata.editedAt.length - 1];
	}
	
	// Helper function to find the newest article in a category
	function getNewestArticle(categoryPages: typeof pagesByCategory[string]): typeof pagesByCategory[string][0] | null {
		if (categoryPages.length === 0) return null;
		return categoryPages.reduce((newest, current) => {
			const newestDate = new Date(getLatestEditDate(newest));
			const currentDate = new Date(getLatestEditDate(current));
			return currentDate > newestDate ? current : newest;
		});
	}

	function formatDate(date: string | Date): string {
		const dateObj = new Date(date);
		return dateObj.toLocaleString("en-US", {
			month: "2-digit",
			day: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: true
		})
	}
</script>

<svelte:head>
	<title>{ogTitle}</title>
	<meta name="description" content={ogDescription} />
	
	<!-- OpenGraph / Facebook -->
	<meta property="og:type" content="article" />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:title" content={ogTitle} />
	<meta property="og:description" content={ogDescription} />
	<meta property="og:site_name" content="Lillith's Learning Notes" />
	
	<!-- Article specific -->
	<meta property="article:published_time" content={publishedTime} />
	<meta property="article:modified_time" content={modifiedTime} />
	{#if pageDef.category}
		<meta property="article:section" content={pageDef.category} />
	{/if}
	
	<!-- Twitter -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={ogTitle} />
	<meta name="twitter:description" content={ogDescription} />
</svelte:head>

<div class="flex min-h-screen">
	<!-- Sidebar -->
	<aside class="sidebar fixed lg:static inset-y-0 left-0 z-40 w-64 shrink-0 bg-white dark:bg-stone-800 border-r border-stone-200 dark:border-stone-700 transform transition-transform duration-200 h-screen lg:h-auto lg:translate-x-0">
		<div class="flex flex-col h-full">
			<!-- Header -->
			<div class="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700">
				<a href="/" class="text-xl font-bold text-stone-900 dark:text-stone-100">
					Lillith's Learning Notes
				</a>
			</div>
			
			<!-- Search -->
			<div class="p-4 border-b border-stone-200 dark:border-stone-700">
				<Search />
			</div>
			
			<!-- Navigation -->
			<nav class="flex-1 overflow-y-auto p-4">
				{#if Object.keys(pagesByCategory).length === 0}
					<p class="text-sm text-stone-500 dark:text-stone-400">No pages found</p>
				{:else}
				{#each Object.entries(pagesByCategory) as [category, categoryPages]}
					{@const newestArticle = getNewestArticle(categoryPages)}
					<div class="mb-6">
						<h3 class="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
							{category}
						</h3>
						<ul class="space-y-1">
							{#each categoryPages as pageItem}
								{@const isNewest = newestArticle?.slug === pageItem.slug}
								<li>
									<a
										href="{pageItem.slug}"
										class="block px-3 py-2 rounded-md text-sm transition-colors {
											currentPath === `${pageItem.slug}`
												? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
												: isNewest
													? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 font-medium'
													: 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
										}"
									>
										{pageItem.metadata.title}
										{#if isNewest}
											<span class="ml-2 text-xs">✨</span>
										{/if}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
				{/if}
			</nav>
		</div>
	</aside>
	

	<!-- Main content -->
	<main class="flex-1 min-w-0">
		<div class="max-w-4xl mx-auto px-6 py-8 lg:px-8">
            <article class="prose prose-lg dark:prose-invert">
                <h1>{metadata.title}</h1>
				<p>Created: {createdAt === "2025-12-01T19:58:38.251Z" ? "before i made this website" : formatDate(createdAt)}</p>
				{#if edits.length > 0}
					<p>Last edited at: {formatDate(edits[edits.length - 1])}</p>
					{#if edits.length > 1}
						<a href={getCommitUrl(pageDef)} class="text-sm text-stone-600 dark:text-stone-400">Edited {edits.length} times</a>
					{/if}
				{/if}
				
				<div class="flex gap-10">
				<a href="{slug}/raw" data-sveltekit-reload>View Raw</a>
					<a href={getDocsUrl(pageDef)} target="_blank">View in Github</a>
					<a href={getCommitUrl(pageDef)} target="_blank">View Commit History</a>
				</div>

				<div class="mt-4 border border-stone-200 dark:border-stone-700 rounded-lg p-4">
					<PageComponent />
				</div>
            </article>
        </div>        
	</main>
</div>