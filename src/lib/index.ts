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
	openForm: false
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
export const areStringsSimilar = (a: string, b: string): boolean => {
	let lowerA = a.toLowerCase();
	let lowerB = b.toLowerCase();

	if (lowerA === lowerB) {
		return true;
	}

	if (a.includes('-')) {
		lowerA = lowerA.replaceAll('-', '')
	}

	if (b.includes('-')) {
		lowerB = lowerB.replaceAll('-', '')
	}

	if (lowerA.includes(lowerB)) {
		return true;
	}
	
	return lowerB.length === 0;
}

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

export const host = dev ? 'http://localhost:5173' : 'https://sveltekit-movie-watchlist.vercel.app'

export const allowedOrigins = ['http://localhost:5173', 'https://sveltekit-movie-watchlist.vercel.app'];
