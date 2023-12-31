import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { addSchema } from './schema';
import { fail, type Actions } from '@sveltejs/kit';
import { host } from '$lib';

export const load = (() => {
	return {
		form: superValidate(addSchema, {
			id: 'addSchema'
		})
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, addSchema, {
			id: 'addSchema'
		});

		if (!form.valid) {
			return fail(400, {
				form,
				valid: false,
				movie: undefined
			});
		}

		const genres: string[] = form.data.genres.split(' ').map((genre) => genre);

		let data: MovieDTO = {
			title: form.data.title,
			genres,
			year: Number(form.data.year),
			rating: Number(form.data.rating),
			watched: form.data.watched
		};

		console.log(`Movie to be added:${JSON.stringify(data)}`);

		try {
			const response: Response = await fetch(`${host}/api/movies`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
			const res = await response.json();

			return {
				form,
				movie: undefined,
				result: res,
				valid: response.ok,
				message: res.message,
				errorMessage: res.errorMessage
			};
		} catch (error: any) {
			return {
				form,
				movie: undefined,
				valid: false,
				errorMessage: error.message
			};
		}
	}
};
