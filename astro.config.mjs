import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
	integrations: [
		// Enable Preact to support Preact JSX components.
		preact(),
		// Enable React for the Algolia search component.
		react(),

	],
	markdown: {
		// Can be 'shiki' (default), 'prism' or false to disable highlighting
		syntaxHighlight: 'shiki',
		shikiConfig: {
			// Choose from Shiki's built-in themes (or add your own)
			// https://github.com/shikijs/shiki/blob/main/docs/themes.md
			theme: 'one-dark-pro',
			// Add custom languages
			// Note: Shiki has countless langs built-in, including .astro!
			// https://github.com/shikijs/shiki/blob/main/docs/languages.md
			langs: ['c', 'python', 'js', 'asm', 'cpp', 'bash'],
			// Enable word wrap to prevent horizontal scrolling
			wrap: true,
		  },
	},
	site: `http://docs.drshw.tech/`,
});
