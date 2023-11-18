import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from './schema';
import { fail, type Actions } from '@sveltejs/kit';
import { movies, addMovie, addGenres } from '$db/collections';
import type { InsertOneResult, MongoError } from 'mongodb';

export const load = (async () => {
	return {
		form: superValidate(formSchema)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		console.log('creating movie data..');
		const form = await superValidate(event, formSchema);
		console.log(`Is Valid: ${form.valid}`);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const genreArray: Genre[] = [];
		
		const genreString: string[] = form.data.genres.split(' ');
		genreString.forEach((genre) => {
			genreArray.push({ id: null, name: genre });
		});

		return addGenres(genreArray)
			.then(async (result: string[]) => {
				console.log(result);
				let data: Movie = {
					id: null,
					title: form.data.title,
					genres: result,
					year: Number(form.data.year),
					rating: Number(form.data.rating),
					watched: false
				};

				try {
					const result_1 = await addMovie(data);
					let res: InsertOneResult<Movie> = JSON.parse(result_1);
					data.id = res.insertedId.toString();
					return {
						form,
						insertedData: JSON.stringify(data),
						posted: form.posted,
						valid: res.acknowledged
					};
				} catch (error) {
					console.log(error);
					return fail(400, {
						form,
						error: JSON.stringify(error),
						valid: false
					});
				}
			})
			.catch((error: MongoError) => {
				console.log(error);
			});
	}
};
