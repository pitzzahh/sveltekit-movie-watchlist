import type { PageServerLoad } from './$types';
import { fetchDataFromMongoDB, genres, getDocumentById, movies } from '$db/collections';
import { superValidate } from 'sveltekit-superforms/server';
import { error, type Actions, fail } from '@sveltejs/kit';
import { mapFetchedGenreToType, mapFetchedMovieToType } from '$lib';
import { deleteSchema } from './schema';
import type { DeleteResult, Document } from 'mongodb';

// Replaced with client side data fetching
// export const load = (async () => {
// 	try {
// 		const movieDocuments: Document[] = await fetchDataFromMongoDB(movies);
// 		const mappedMovies: Movie[] = movieDocuments.map((doc: Document) => mapFetchedMovieToType(doc))

// 		const finalMovies: Movie[] = await Promise.all(mappedMovies.map(async (m) => {
// 			const movieGenres = m.genres ? await Promise.all(m.genres.map(async (genreId: string) => {
// 				const genreDoc: Document = await getDocumentById(genres, genreId);
// 				const genre: Genre = mapFetchedGenreToType(genreDoc);
// 				return genre.name;
// 			})) : [];
// 			return { ...m, genres: movieGenres, _id: m._id };
// 		}));

// 		return {
// 			movies: finalMovies,
// 			form: await superValidate(deleteSchema)
// 		};
// 	} catch (err: any) {
// 		throw error(500, `${err}`)
// 	}
// }) satisfies PageServerLoad;


// create a server action named deleteMovie
export const actions: Actions = {
	deleteMovie: async ({ cookies, request }) => {
		console.log('deleting movie data..');
		const data = await request.formData();

		const movieIdData = data.get('movieId')

		console.log(`Found id: ${movieIdData}`)

		if (!movieIdData) {
			return {
				valid: false,
				errorMessage: "Invalid movie Id"
			}
		}

		const movieId: string = movieIdData.toString()

		const fetchedMovie: Document = await getDocumentById(movies, movieId);

		if(!fetchedMovie) {
			return {
				valid: false,
				errorMessage: `Movie with id ${movieId} is not a movie document!`
			}
		}

		console.log(`Deleting movie with id: ${movieIdData}`)

		try {
			const response: DeleteResult = await movies.deleteOne({ $oid: movieId })
			const isAcknowledged = response.acknowledged;
			const deleteCount = response.deletedCount;
			const isValid = isAcknowledged && deleteCount === 1;

			console.log(`is acknowledged: ${response.acknowledged}`)
			console.log(`Delete count: ${deleteCount}`)

			if (!isValid) {
				return {
					valid: false,
					errorMessage: "Cannot delete movie, "
				}
			}

			return {
				valid: isValid,
				message: `Movie with id ${movieIdData} removed sucessfully`
			};
		} catch (err: any) {
			throw error(500, `${err}`)
		}
	}
}