import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { addSchema } from './schema';

export const prerender = true;

export const load = (() => {
	return {
		form: superValidate(addSchema, {
			id: "addSchema"
		})
	};
}) satisfies PageServerLoad;
