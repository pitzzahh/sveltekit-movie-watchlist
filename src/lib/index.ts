import type { Document } from "mongodb";
import { writable } from "svelte/store";

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
	errorMessage: undefined
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
    let lowerStr1 = a.toLowerCase();
    let lowerStr2 = b.toLowerCase();

	if(a.includes('-')) {
		lowerStr1 = a.replaceAll('-', ' ')
	}

	if(b.includes('-')) {
		lowerStr1 = a.replaceAll('-', ' ')
	}

	if(lowerStr1 === lowerStr2) {
		return true;
	}

	if(lowerStr1.includes(lowerStr2)) {
		return true;
	}

	if(lowerStr1.startsWith(lowerStr2)) {
		return true;
	}

	if(lowerStr2.startsWith(lowerStr1)) {
		return true;
	}

    for (let char of lowerStr1) {
        const charIndex = lowerStr2.indexOf(char);
        if (charIndex !== -1) {
            lowerStr2.slice(charIndex, 1);
        } else {
            return false;
        }
    }
    return lowerStr2.length === 0;
}