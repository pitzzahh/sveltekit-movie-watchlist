import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from './schema';
import { store } from '$lib';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import { movies } from '$db/collections';

export const load = (async () => {
	return {
		form: superValidate(formSchema)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createMovie: async (event) => {
		const form = await superValidate(event, formSchema);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const genreString: string[] = form.data.genre.split(' ');
		const genreArray: Genre[] = [];

		genreString.forEach((genre) => {
			genreArray.push({ id: null, name: genre });
		});

		console.log(genreArray);
		const result = await movies.insertOne({
			id: null,
			title: form.data.title,
			genres: genreArray,
			year: Number(form.data.year),
			rating: Number(form.data.rating),
			watched: false
		});

		console.log('submitted form');

		return {
			form,
			Tresult: JSON.stringify(result),
		};

	}
};
