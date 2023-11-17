import db from '$db/mongo';
import type { InsertOneResult } from 'mongodb';

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
			const result: InsertOneResult<Movie> = await movies.insertOne(movieData);

			if (result.acknowledged) {
				resolve(JSON.stringify(result));
			} else {
				reject(`Error adding movie: ${result}`);
			}
		} catch (error) {
			reject(`Error adding movie: ${error}`);
		}
	});
};

export const fetchDataFromMongoDB = async (collection: any) => {
    return await collection.find({}).toArray();
};
