import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from './schema';
import { fail, type Actions } from '@sveltejs/kit';
import { movies } from '$db/collections';

export const load = (async () => {
	return {
		form: superValidate(formSchema)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createMovie: async (event) => {
        console.log('creating movie data..')
		const form = await superValidate(event, formSchema);
		console.log(`Is Valid: ${form.valid}`);
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

		try {
			const result = await movies.insertOne({
				id: null,
				title: form.data.title,
				genres: genreArray,
				year: Number(form.data.year),
				rating: Number(form.data.rating),
				watched: false
			});

			return {
				form,
				Tresult: JSON.stringify(result),
				valid: form.valid
			};
		} catch (error) {
            console.log(error);
			return fail(400, {
				form,
				error: JSON.stringify(error),
				valid: false
			});
		}
	}
};
