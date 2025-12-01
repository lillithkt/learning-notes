import { mdsvex, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const shikiTheme = 'one-dark-pro';
const highlighter = await createHighlighter({
	themes: [shikiTheme],
	langs: ['javascript', 'typescript', 'rust']
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex({
		highlight: {
			highlighter: async (code, lang = 'text') => {
				const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme: shikiTheme }));
				return `{@html \`${html}\` }`;
			}
		}
	})],
	kit: { adapter: adapter() },
	extensions: ['.svelte', '.svx']
};

export default config;
