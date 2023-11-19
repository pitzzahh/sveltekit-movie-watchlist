import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { updateSchema } from '../schema';
import { fail, type Actions, type RequestEvent, error } from '@sveltejs/kit';
import { genres, getDocumentById, movies } from '$db/collections';
import { mapFetchedGenreToType, mapFetchedMovieToType, store } from '$lib';
import type { Document } from 'mongodb';

export const load = (async (event: RequestEvent) => {
    try {
        const fetchedMovie: Document = await getDocumentById(movies, event.params.id);

        const movie: Movie | undefined = mapFetchedMovieToType(fetchedMovie);

        if (!movie) {
            throw error(404, 'Movie not found');
        }

        const movieGenres: string[] = movie.genres ? await Promise.all(movie.genres.map(async (genreId: string) => {
            const genreDoc: Document = await getDocumentById(genres, genreId);
            const genre = mapFetchedGenreToType(genreDoc);
            return genre.name;
        })) : [];

        const updatedMovie: Movie = movieGenres ? { ...movie, genres: movieGenres, _id: movie._id.toString() } : { ...movie, _id: movie._id.toString() };

        console.log(`Movie with apprpriate genres: ${JSON.stringify(updatedMovie)}`);

        return {
            movie: updatedMovie,
            form: superValidate(updateSchema, {
                id: 'updateSchema'
            }),
        };
    } catch (err: any) {
        throw error(500, `${err}`);
    }
}) satisfies PageServerLoad;

export const actions: Actions = {
    updateMovie: async (event: RequestEvent<Partial<Record<string, string>>, string | null>) => {
        console.log('modifying movie data..');
        const form = await superValidate(event, updateSchema, {
            id: 'updateSchema'
        });
        console.log(`Is modified movie data valid: ${form.valid}`);
        if (!form.valid) {
            return fail(400, {
                form
            });
        }

        const genreArray: Genre[] = [];

        const genreString: string[] = form.data.genres.split(' ');
        genreString.forEach((genre) => {
            genreArray.push({
                _id: '',
                name: genre
            });
        });

        if (!event.params.id) {
            return fail(400, {
                form
            });
        }

        let data: Movie = {
            _id: event.params.id,
            title: form.data.title,
            genres: [],
            year: Number(form.data.year),
            rating: Number(form.data.rating),
            watched: false
        };

        // TODO: fix 
        return {
            form,
            movie: data,
            posted: form.posted,
            valid: true
        };
    }
}