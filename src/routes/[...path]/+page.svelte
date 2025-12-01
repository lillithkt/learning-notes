<script lang="ts">
	import { pagesByCategory } from '$lib/pages';
	import { page } from '$app/state';
    import { pages } from '$lib/pages';

	const { data } = $props();
	const { rawContent } = data;
	console.log(rawContent);


	const currentPath = $derived(page.url.pathname);
	const shouldShowRaw = $derived(page.url.searchParams.get('raw') !== null);
    const slug = $derived("/" + page.params.path);
    const pageDef = $derived(pages.get(slug)!)
    const PageComponent = $derived(pageDef.content)
    const metadata = $derived(pageDef.metadata)

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
{#if shouldShowRaw}
	<div class="flex min-h-screen bg-white dark:bg-stone-900">
		<pre class="p-4 text-stone-900 dark:text-stone-100">{rawContent}</pre>
		<a href="{slug}?raw=false">View Normal</a>
	</div>
{:else}
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
			
			<!-- Navigation -->
			<nav class="flex-1 overflow-y-auto p-4">
				{#if Object.keys(pagesByCategory).length === 0}
					<p class="text-sm text-stone-500 dark:text-stone-400">No pages found</p>
				{:else}
				{#each Object.entries(pagesByCategory) as [category, pages]}
				<div class="mb-6">
					<h3 class="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
						{category}
							</h3>
							<ul class="space-y-1">
								{#each pages as pageItem}
									<li>
										<a
											href="{pageItem.slug}"
											class="block px-3 py-2 rounded-md text-sm transition-colors {
												currentPath === `${pageItem.slug}`
													? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
													: 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
													}"
										>
										{pageItem.metadata.title}
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
				<p>Created at: {metadata.createdAt === "2025-12-01T19:58:38.251Z" ? "Before i started tracking in git" : formatDate(metadata.createdAt)}</p>
				{#if metadata.editedAt && metadata.editedAt !== metadata.createdAt}
					<p>Edited at: {formatDate(metadata.editedAt)}</p>
				{/if}
				<a href="{slug}?raw=true">View Raw</a>

				<div class="mt-4 border border-stone-200 dark:border-stone-700 rounded-lg p-4">
					<PageComponent />
				</div>
            </article>
        </div>        
	</main>
</div>



{/if}