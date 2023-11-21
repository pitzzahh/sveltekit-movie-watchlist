import { error } from "@sveltejs/kit";
import type { Document } from "mongodb";
import { writable } from "svelte/store";

const dev = false;

export const movieFormInfo = [
	{
		name: 'title',
		label: 'Title',
		description: 'The title of the movie'
	},
	{
		name: 'genres',
		label: 'Genres',
		description: 'The genres of the movie separated by spaces'
	},
	{
		name: 'year',
		label: 'Year of release',
		description: 'The year the movie was released'
	},
	{
		name: 'rating',
		label: 'Rating',
		description: 'The rating of the movie'
	},

];

export const store = writable({
	openForm: false,
	isProcessing: false,
	movie: '',
	movies: Promise.resolve([] as Movie[])
});

export const mapFetchedMovieToType = (fetchedMovie: Document): Movie => {
	return {
		_id: fetchedMovie._id.toString(),
		title: fetchedMovie.title,
		genres: fetchedMovie.genres,
		year: fetchedMovie.year,
		rating: fetchedMovie.rating,
		watched: fetchedMovie.watched,
	}
};

export const mapFetchedGenreToType = (fetchedGenre: Document): Genre => {
	return {
		_id: fetchedGenre._id.toString(),
		name: fetchedGenre.name
	}
};

/**
 * Check if two strings are similar, ignoring case and considering partial matches.
 * @param {string} a - The first string to compare.
 * @param {string} b - The second string to compare.
 * @returns {boolean} - True if the strings are similar, false otherwise.
 */
export const areStringsSimilar = async (a: string, b: string): Promise<boolean> => {
	try {
		console.log('Fetching movies from api server')
		const response: Response = await fetch(`${host}/api/validation`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				string1: a,
				string2: b
			})
		});
		if (response.ok) {
			const result = await response.json()
			console.log(`Are similar result: ${JSON.stringify(result)}`)
			return result.responseText
		} else {
			throw error(response.status, `Failed to check similarity. Status: ${response.statusText}`);
		}
	} catch (err) {
		throw error(400, `Error checking similarity: ${err}`);
	}
};


export const fetchMovies = async (): Promise<Movie[]> => {
	try {
		console.log('Fetching movies from api server')
		const response: Response = await fetch(
			`${host}/api/movies`,
			{
				method: 'GET'
			}
		);
		if (response.ok) {
			return await response.json();
		} else {
			throw error(response.status, `Failed to fetch movies. Status: ${response.statusText}`);
		}
	} catch (err) {
		throw error(400, `Error fetching movies: ${err}`);
	}
};

export const host = dev ? 'https://fuzzy-space-couscous-jprqjx649xwfpw5w-5173.app.github.dev' : 'https://sveltekit-movie-watchlist.vercel.app'

export const allowedOrigins = ['https://fuzzy-space-couscous-jprqjx649xwfpw5w-5173.app.github.dev', 'https://sveltekit-movie-watchlist.vercel.app'];
