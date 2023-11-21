import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { fail, type Actions, type RequestEvent, error } from '@sveltejs/kit';
import { genres, getDocumentById, movies } from '$db/collections';
import { fetchMovies, host, mapFetchedGenreToType, mapFetchedMovieToType, store } from '$lib';
import type { Document, MongoServerError } from 'mongodb';
import { modifySchema } from './schema';

/** @type {import('./$types').EntryGenerator} */
export async function entries() {
	return (await fetchMovies()).map((movie) => ({ id: movie._id }));
}

export const load = (async (event: RequestEvent) => {
	console.log(`Loading movie with id: ${event.params.id}`);

	return getDocumentById(movies, event.params.id)
		.then(async (fetchedMovie) => {
			const movie: Movie | undefined = mapFetchedMovieToType(fetchedMovie);

			const movieGenres: string[] = movie.genres
				? await Promise.all(
						movie.genres.map(async (genreId: string) => {
							return getDocumentById(genres, genreId)
								.then((genreDoc: Document) => mapFetchedGenreToType(genreDoc).name)
								.catch(() => 'NotFound');
						})
				  )
				: [];
			const updatedMovie: Movie = movieGenres
				? { ...movie, genres: movieGenres, _id: movie._id.toString() }
				: { ...movie, _id: movie._id.toString() };

			console.log(`Movie with appropriate genres: ${JSON.stringify(updatedMovie)}`);
			return {
				movie: updatedMovie,
				form: await superValidate(modifySchema, {
					id: 'modifySchema'
				})
			};
		})
		.catch((e: MongoServerError) => {
			throw error(404, 'Not Found');
		});
}) satisfies PageServerLoad;

export const actions: Actions = {
	modifyMovie: async (event) => {
		const form = await superValidate(event, modifySchema, {
			id: 'modifySchema'
		});

		store.update((state) => ({
			...state,
			movie: form.data.title,
			isProcessing: true
		}));

		if (!form.valid) {
			return fail(400, {
				form,
				valid: false
			});
		}

		const genres: string[] = form.data.genres.split(' ').map((genre) => genre);

		let data: MovieDTO = {
			title: form.data.title,
			genres,
			year: Number(form.data.year),
			rating: Number(form.data.rating),
			watched: false
		};

		console.log(`Movie to be updated:${JSON.stringify(data)}`);

		try {
			const response: Response = await fetch(`${host}/api/movies`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
			const res = await response.json();

			store.update((state) => ({
				...state,
				isProcessing: false
			}));

			return {
				form,
				result: res,
				valid: response.ok,
				errorMessage: res.errorMessage
			};
		} catch (error: any) {
			store.update((state) => ({
				...state,
				isProcessing: false
			}));
			return {
				form,
				valid: false,
				errorMessage: error.message
			};
		}
	}
};
