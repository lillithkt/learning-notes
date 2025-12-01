<script lang="ts">
	import { pagesByCategory, allPages } from '$lib/pages';
</script>

<div class="max-w-6xl mx-auto px-6 py-12 lg:px-8">
	<div class="text-center mb-12">
		<h1 class="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
			Lillith's Learning Notes
		</h1>
		<p class="text-xl text-gray-600 dark:text-gray-400">
			learning different languages
		</p>
	</div>
	
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each Object.entries(pagesByCategory) as [category, pages]}
			<div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
				<h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 capitalize">
					{category}
				</h2>
				<ul class="space-y-2">
					{#each pages as page}
						<li>
							<a
								href="{page.slug}"
								class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline block py-1"
							>
								{page.metadata.title}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
	
	<div class="mt-12 text-center">
		<p class="text-gray-600 dark:text-gray-400">
			Total pages: {allPages.length}
		</p>
	</div>
</div>
