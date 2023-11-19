import type { PageServerLoad } from './$types';
import { fetchDataFromMongoDB, genres, getDocumentById, movies } from '$db/collections';
import { superValidate } from 'sveltekit-superforms/server';
import { error, type Actions, fail } from '@sveltejs/kit';
import { mapFetchedGenreToType, mapFetchedMovieToType } from '$lib';
import type { DeleteResult, Document } from 'mongodb';
import { deleteSchema } from './schema';

export const load = (async ({ fetch }) => {
	try {
		const movieDocuments: Document[] = await fetchDataFromMongoDB(movies);
		const mappedMovies: Movie[] = movieDocuments.map((doc: Document) => mapFetchedMovieToType(doc))

		const finalMovies: Movie[] = await Promise.all(mappedMovies.map(async (m) => {
			const movieGenres = m.genres ? await Promise.all(m.genres.map(async (genreId: string) => {
				const genreDoc: Document = await getDocumentById(genres, genreId);
				const genre: Genre = mapFetchedGenreToType(genreDoc);
				return genre.name;
			})) : [];
			return { ...m, genres: movieGenres, _id: m._id };
		}));

		return {
			movies: finalMovies,
			form: superValidate(deleteSchema, {
				id: 'deleteSchema'
			})
		};
	} catch (err: any) {
		throw error(500, `${err}`)
	}
}) satisfies PageServerLoad;


// create a server action named deleteMovie
export const actions: Actions = {
	deleteMovie: async (event) => {
		console.log('deleting movie data..');
		const form = await superValidate(event, deleteSchema, {
			id: 'deleteSchema'
		});
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const movieId: string = form.data.movieId;
		console.log(`Deleting movie with id: ${movieId}`)

		try {
			const response: DeleteResult = await movies.deleteOne({ _id: movieId })
			const isValid = response.acknowledged && response.deletedCount === 1;

			if (!isValid) {
				return fail(400, {
					form,
					errorMessage: "Cannot delete movie, "
				});
			}
			return {
				form,
				valid: isValid,
				errorMessage: `Movie with id ${movieId} removd sucessfully`
			};
		} catch (err: any) {
			throw error(500, `${err}`)
		}
	}
}