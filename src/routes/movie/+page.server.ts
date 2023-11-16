import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from './schema';
export const load: PageServerLoad = () => {
	return {
		form: superValidate(formSchema)
	};
};
export const actions: Actions = {
	default: async (event) => {
        console.log('submitted form');
		const form = await superValidate(event, formSchema);
        console.log(form.data);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		return {
			form
		};
	}
};
