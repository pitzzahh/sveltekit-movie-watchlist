import db from '$db/mongo';
import { areStringsSimilar, mapFetchedGenreToType, mapFetchedMovieToType } from '$lib';
import { error } from '@sveltejs/kit';
import {
	type Collection,
	type FindCursor,
	type Document,
	type InsertManyResult,
	type InsertOneResult,
	ObjectId,
	type WithId,
	MongoServerError
} from 'mongodb';

export const movies: Collection<MovieDTO> = db.collection<MovieDTO>('movies');
export const genres: Collection<GenreDTO> = db.collection<GenreDTO>('genres');

/**
 * Adds a new movie to the 'movies' collection.
 * @param movieData - The data for the new movie.
 * @returns Promise<string> - Resolves with the ID of the added movie.
 */
export const addMovie = (movieData: MovieDTO): Promise<string> => {
	return new Promise(async (resolve, reject) => {
		return movies
			.insertOne(movieData)
			.then((res: InsertOneResult<Movie>) => {
				if (res.acknowledged) {
					resolve(JSON.stringify(res));
				} else {
					reject(`Adding movie not acknowledged: ${res}`);
				}
			})
			.catch((err) => {
				reject(`Error adding movie: ${err}`);
			});
	});
};

/**
 * Adds new genres to the 'genres' collection.
 * @param genresData - The genres to be added.
 * @returns Promise<string[]> - Resolves with the ID of the added genres.
 */
export const addGenres = (genresData: GenreDTO[]): Promise<string[]> => {
	return new Promise(async (resolve, reject) => {
		let genreIds: string[] = [];
		return fetchDataFromMongoDB(genres)
			.then(async (genresDocument: Document[]) => {
				const mappedGenres: Genre[] = genresDocument.map((doc: Document) =>
					mapFetchedGenreToType(doc)
				);

				for (const gData of genresData) {
					const foundGenre: Genre | undefined = mappedGenres.find(
						async (g) => await areStringsSimilar(g.name, gData.name)
					);
					console.log(`Similar Genre: ${JSON.stringify(foundGenre)}`);

					if (foundGenre) {
						genreIds = [...genreIds, foundGenre._id.toString()];
					} else {
						const genreToBeAdded: GenreDTO = {
							name: gData.name
						};

						console.info(`New Genre: ${JSON.stringify(genreToBeAdded)}, adding to collection`);

						const addingResult = await genres
							.insertOne(genreToBeAdded)
							.then((result: InsertOneResult<Genre>) => {
								genreIds = [...genreIds, result.insertedId.toString()];
								console.log(`Genre ${JSON.stringify(genreToBeAdded.name)} added to collection`);
							})
							.catch((err: MongoServerError) => {
								console.error(`${err.message}`);
							});
					}
				}
				console.log('Done adding genres to collection');
				resolve(genreIds);
			})
			.catch((error: MongoServerError) => {
				reject(error.message);
			});
	});
};

export const updateMovieByid = async (id: string, movie: Movie): Promise<boolean> => {
	return new Promise(async (resolve, reject) => {
		const movieDocuments: Document[] = await fetchDataFromMongoDB(movies, {
			_id: new ObjectId(id)
		});
		const mappedMovies: Movie[] = movieDocuments.map((doc: Document) => mapFetchedMovieToType(doc));
		const res: Movie | undefined = mappedMovies.find((m) => m.title === movie.title);
	});
};

export const fetchDataFromMongoDB = async (
	collection: any,
	options?: Record<string, any>
): Promise<Document[]> => {
	try {
		const cursor: FindCursor<Document[]> = collection.find(options);
		return await cursor.toArray();
	} catch (err: any) {
		throw error(err.code ? Number(err.code) : 500, `Error fetching data from MongoDB: ${error}`);
	}
};

// Modify getDocumentById method
export const getDocumentById = async (
	collection: Collection<any>,
	id: string | undefined
): Promise<Document> => {
	return new Promise(async (resolve, reject) => {
		try {
			const result: Document[] = await fetchDataFromMongoDB(collection, { _id: new ObjectId(id) });
			if (result.length === 0) {
				reject(`Document with id ${id} not found`);
			}
			resolve(result[0]);
		} catch {
			reject(`Document with id ${id} not found`);
		}
	});
};
