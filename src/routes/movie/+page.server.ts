import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from './schema';
import { fail, type Actions } from '@sveltejs/kit';
import { movies, addMovie } from '$db/collections';
import type { InsertOneResult, MongoError } from 'mongodb';

export const load = (async () => {
	return {
		form: superValidate(formSchema)
	};
}) satisfies PageServerLoad;


export const actions: Actions = {
	default: async (event) => {
		console.log('creating movie data..')
		const form = await superValidate(event, formSchema);
		console.log(`Is Valid: ${form.valid}`);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const genreString: string[] = form.data.genres.split(' ');
		const genreArray: Genre[] = [];

		genreString.forEach((genre) => {
			genreArray.push({ id: null, name: genre });
		});

		let data: Movie = {
			id: null,
			title: form.data.title,
			genres: genreArray,
			year: Number(form.data.year),
			rating: Number(form.data.rating),
			watched: false
		}

		return addMovie(data)
			.then((result: any) => {
				let res: InsertOneResult<Movie> = JSON.parse(result)
				return {
					form,
					insertedData: JSON.stringify(data),
					posted: form.posted,
					valid: res.acknowledged
				};
			}).catch((error: MongoError) => {
				console.log(error);
				return fail(400, {
					form,
					error: JSON.stringify(error),
					valid: false
				});
			})
	}
};
