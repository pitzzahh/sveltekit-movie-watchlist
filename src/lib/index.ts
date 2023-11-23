import { error } from '@sveltejs/kit';
import type { Document } from 'mongodb';
import { writable } from 'svelte/store';
import s from 'string-similarity';

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
	}
];

export const store = writable({
	openForm: false,
	isProcessing: false,
	movies: Promise.resolve([] as Movie[])
});

export const mapFetchedMovieToType = (fetchedMovie: Document): Movie => {
	return {
		_id: fetchedMovie._id.toString(),
		title: fetchedMovie.title,
		genres: fetchedMovie.genres,
		year: fetchedMovie.year,
		rating: fetchedMovie.rating,
		watched: fetchedMovie.watched
	};
};

export const mapFetchedGenreToType = (fetchedGenre: Document): Genre => {
	return {
		_id: fetchedGenre._id.toString(),
		name: fetchedGenre.name
	};
};

const pascalCache: any = {};
/**
 * Formats a string to Pascal case. From https://stackoverflow.com/a/73876341
 * @param {string} inputString - The input string to be formatted.
 * @returns {string} - The formatted string.
 */
export const toPascalCase = (str: string): string => {
	pascalCache[str] =
		pascalCache[str] ||
		(/^[\p{L}\d]+$/iu.test(str) && str.charAt(0).toUpperCase() + str.slice(1)) ||
		str
			.replace(/([\p{L}\d])([\p{L}\d]*)/giu, (_g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase())
			.replace(/[^\p{L}\d]/giu, '');
	return pascalCache[str];
};

/**
 * Check if two strings are similar, ignoring case and considering partial matches.
 * @param {string} a - The first string to compare.
 * @param {string} b - The second string to compare.
 * @returns {boolean} - True if the strings are similar, false otherwise.
 */
export const areStringsSimilar = (
	a: string,
	b: string,
	genreCheck: boolean = false,
	threshHold: number = 0.5
): boolean => {
	const similarityThreshold = threshHold ? threshHold : 0.1;
	if (genreCheck) {
		return s.compareTwoStrings(a.toLowerCase(), b.toLowerCase()) > similarityThreshold;
	}
	const cleanString = (str: string): string => str.replace(/[-\s]/g, '');
	const result =
		levenshteinDistance(cleanString(a.toLowerCase()), cleanString(b.toLowerCase())) <=
		similarityThreshold;
	console.log(`Comparing ${a} and ${b}: ${result}`);
	return result;
};

// Function to calculate Levenshtein distance between two strings
const levenshteinDistance = (a: string | any[], b: string | any[]) => {
	const m = a.length;
	const n = b.length;

	const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

	for (let i = 0; i <= m; i++) {
		for (let j = 0; j <= n; j++) {
			if (i === 0) {
				dp[i][j] = j;
			} else if (j === 0) {
				dp[i][j] = i;
			} else {
				dp[i][j] = Math.min(
					dp[i - 1][j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0),
					dp[i][j - 1] + 1,
					dp[i - 1][j] + 1
				);
			}
		}
	}

	return dp[m][n];
};

export const fetchMovies = async (): Promise<Movie[]> => {
	try {
		console.log('Fetching movies from api server');
		const response: Response = await fetch(`${host}/api/movies`, {
			method: 'GET'
		});
		return response.json().then((data) => {
			if (response.ok) {
				return data;
			} else {
				throw error(response.status, `Failed to fetch movies. Status: ${data.statusText}`);
			}
		});
	} catch (err) {
		throw error(400, `Error fetching movies: ${err}`);
	}
};

export const host: string = dev
	? 'https://didactic-succotash-jprqjx6465php756-5173.app.github.dev'
	: 'https://sveltekit-movie-watchlist.vercel.app';