import db from '$db/mongo';
import type { InsertManyResult, InsertOneResult } from 'mongodb';

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


/**
 * Adds a new movie to the 'movies' collection.
 * @param movieData - The data for the new movie.
 * @returns Promise<string> - Resolves with the ID of the added movie.
 */
export const addGenres = (genre: Genre[]): Promise<string[]> => {
	return new Promise(async (resolve, reject) => {
		try {

			// check if genre already exists in db
			// if it does, add the id to the genreIds array
			let genreIds: string[] = [];
			genre.forEach((genre) => {
				genres.findOne({ name: genre.name }).then((result) => {
					if (result) {
						genreIds.push(result._id.toString());
					}
					else {
						genres.insertOne(genre).then((result) => {
							genreIds.push(result.insertedId.toString());
						});
					}
				});
			});

			const result: InsertManyResult<Genre> = await genres.insertMany(genre);
			
			if (result.acknowledged) {
				resolve(genreIds);
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
