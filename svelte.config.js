import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess({})],
	runtime: 'edge',
	kit: {
		adapter: adapter(),
		alias: {
			$lib: './src/lib',
			$db: './src/db'
		}
	}
};

export default config;
