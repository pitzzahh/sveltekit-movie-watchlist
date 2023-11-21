import { error } from '@sveltejs/kit';
import type { Document } from 'mongodb';
import { writable } from 'svelte/store';

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
		watched: fetchedMovie.watched
	};
};

export const mapFetchedGenreToType = (fetchedGenre: Document): Genre => {
	return {
		_id: fetchedGenre._id.toString(),
		name: fetchedGenre.name
	};
};

// /**
//  * Check if two strings are similar, ignoring case and considering partial matches.
//  * @param {string} a - The first string to compare.
//  * @param {string} b - The second string to compare.
//  * @returns {boolean} - True if the strings are similar, false otherwise.
//  */
// export const areStringsSimilar = async (a: string, b: string): Promise<boolean> => {
// 	try {
// 		console.log('Fetching movies from api server');
// 		const response: Response = await fetch(`${host}/api/validation`, {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json'
// 			},
// 			body: JSON.stringify({
// 				a,
// 				b
// 			})
// 		});
// 		if (response.ok) {
// 			console.info(`Response from checking similarity: ${JSON.stringify(response)}`);
// 			const result = await response.json();
// 			console.log(`Are similar result: ${JSON.stringify(result)}`);
// 			return result.isSimilar;
// 		} else {
// 			console.error(`Failed to check similarity. Status: ${response.statusText}`);
// 			throw error(response.status, `Failed to check similarity. Status: ${response.statusText}`);
// 		}
// 	} catch (err) {
// 		console.error(`Error checking similarity: ${err}`);
// 		throw error(400, `Error checking similarity: ${err}`);
// 	}
// };

/**
 * Check if two strings are similar, ignoring case and considering partial matches.
 * @param {string} a - The first string to compare.
 * @param {string} b - The second string to compare.
 * @returns {boolean} - True if the strings are similar, false otherwise.
 */
export const areStringsSimilar = (a: string, b: string) => {
    // Convert strings to lowercase for case-insensitive comparison
    let lowerA = a.toLowerCase();
    let lowerB = b.toLowerCase();

	lowerA = lowerA.replaceAll(' ', '')
	lowerB = lowerB.replaceAll(' ', '')
    const distance = levenshteinDistance(lowerA, lowerB);

    const similarityThreshold = 3;

    return distance <= similarityThreshold;
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
		if (response.ok) {
			return await response.json();
		} else {
			throw error(response.status, `Failed to fetch movies. Status: ${response.statusText}`);
		}
	} catch (err) {
		throw error(400, `Error fetching movies: ${err}`);
	}
};

export const host = dev
	? 'https://fuzzy-space-couscous-jprqjx649xwfpw5w-5173.app.github.dev'
	: 'https://sveltekit-movie-watchlist.vercel.app';

export const allowedOrigins = [
	'https://fuzzy-space-couscous-jprqjx649xwfpw5w-5173.app.github.dev',
	'https://sveltekit-movie-watchlist.vercel.app'
];
