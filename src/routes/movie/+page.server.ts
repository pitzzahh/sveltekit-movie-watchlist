import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { addSchema } from './schema';
import { error, fail, type Actions } from '@sveltejs/kit';
import { movies, addMovie, addGenres, fetchDataFromMongoDB } from '$db/collections';
import type { InsertOneResult, MongoError, Document, MongoServerError } from 'mongodb';
import { areStringsSimilar, mapFetchedMovieToType } from '$lib';

export const load = (() => {
	return {
		form: superValidate(addSchema, {
			id: "addSchema"
		})
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		console.log('creating movie data..');
		const form = await superValidate(event, addSchema, {
			id: "addSchema"
		});
		console.log(`Is Valid: ${form.valid}`);

		if (!form.valid) {
			return {
				form,
				valid: false,
				errorMessage: 'Invalid inputs'
			};
		}

		const movieDocuments: Document[] = await fetchDataFromMongoDB(movies)
		const mappedMovies: Movie[] = movieDocuments.map((doc: Document) => mapFetchedMovieToType(doc))
		const res: Movie | undefined = mappedMovies.find((m) => areStringsSimilar(m.title, form.data.title))

		console.log(`Movie already exists: ${res != undefined}`)
		if (res) {
			return {
				form,
				valid: false,
				errorMessage: 'Movie already exists'
			};
		}

		const genreArray: Genre[] = [];

		const genreString: string[] = form.data.genres.split(' ');
		genreString.forEach((genre) => {
			genreArray.push({ _id: '', name: genre });
		});

		return addGenres(genreArray)
			.then(async (genreResult: string[]) => {
				console.log(`Generated genre id\'s for movie ${form.data.title} : ${genreResult}`);
				let data = {
					title: form.data.title,
					genres: genreResult,
					year: Number(form.data.year),
					rating: Number(form.data.rating),
					watched: false
				};
				return addMovie(data)
					.then((response: string) => {
						let res: InsertOneResult<Movie> = JSON.parse(response);
						console.log(`Inserted movie result: ${JSON.stringify(res)}`)
						if (!res.acknowledged) {
							return fail(400, {
								form,
								error: JSON.stringify(error),
								valid: false
							});
						}
						return {
							form,
							insertedData: { ...data, _id: res.insertedId.toString() },
							posted: form.posted,
							valid: res.acknowledged
						};
					})
					.catch((err: MongoServerError) => {
						return fail(400, {
							form,
							error: JSON.stringify(error),
							valid: false,
							errorMessage: err.message
						});
					})
			})
			.catch((err: MongoServerError) => {
				return fail(400, {
					form,
					error: JSON.stringify(error),
					valid: false,
					errorMessage: err.message
				});
			});
	}
};
