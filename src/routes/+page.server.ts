import type { PageServerLoad, Actions } from './$types';
import { movies } from '$db/movies';
import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from './movie/schema';
import { fail } from '@sveltejs/kit';

export const load = (async () => {
	const data = (await movies.find({}).toArray()).map((movie) => ({
		...movie,
		_id: movie._id.toString()
	}));

	return {
		status: data.length ? 200 : 404,
		movies: data,
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
		const result = await movies.insertOne({
			id: null,
			title: form.data.title,
			genre: form.data.genre,
			year: Number(form.data.year),
			rating: Number(form.data.rating),
			watched: false
		});

		console.log('submitted form');
		return {
			form,
			Tresult: JSON.stringify(result)
		};
	},
	deleteMovie: async (event) => {
		console.log('deleting movie');
		const data = await event.request.formData();
		const id = data.get('id');
		console.log(id);
	}
};
