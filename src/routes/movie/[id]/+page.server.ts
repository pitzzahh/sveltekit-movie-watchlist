import type { EntryGenerator, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { fail, type Actions, type RequestEvent, error } from '@sveltejs/kit';
import { genres, getDocumentById, movies } from '$db/collections';
import { fetchMovies, mapFetchedGenreToType, mapFetchedMovieToType, store } from '$lib';
import type { Document } from 'mongodb';
import { updateSchema } from './schema';

export const prerender = true;

/** @type {import('./$types').EntryGenerator} */
export async function entries() {
	return (await fetchMovies()).map(movie => ({ id: movie._id }))
}

export const load = (async (event: RequestEvent) => {
    try {

        const fetchedMovie: Document = await getDocumentById(movies, event.params.id);

        const movie: Movie | undefined = mapFetchedMovieToType(fetchedMovie);

        const movieGenres: string[] = movie.genres ? await Promise.all(movie.genres.map(async (genreId: string) => {
            const genreDoc: Document = await getDocumentById(genres, genreId);
            const genre = mapFetchedGenreToType(genreDoc);
            return genre.name;
        })) : [];

        const updatedMovie: Movie = movieGenres ? { ...movie, genres: movieGenres, _id: movie._id.toString() } : { ...movie, _id: movie._id.toString() };

        console.log(`Movie with apprpriate genres: ${JSON.stringify(updatedMovie)}`);

        return {
            movie: updatedMovie,
            form: await superValidate(updateSchema, {
                id: 'updateSchema'
            }),
        };
    } catch (err: any) {
        throw error(500, `${err}`);
    }
}) satisfies PageServerLoad;