import db from '$db/mongo';

export const movies = db.collection<Movie>('movies');
export const genres = db.collection<Genre>('genres');

/**
 * Adds a new movie to the 'movies' collection.
 * @param movieData - The data for the new movie.
 * @returns Promise<string> - Resolves with the ID of the added movie.
 */
export const addMovie = (movieData: Movie): Promise<string> => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await movies.insertOne(movieData);

			if (result.acknowledged) {
				resolve(result.insertedId.toString());
			} else {
				reject(`Error adding movie: ${result}`);
			}
		} catch (error) {
			reject(`Error adding movie: ${error}`);
		}
	});
};
