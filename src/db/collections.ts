import db from '$db/mongo';
import { areStringsSimilar, mapFetchedGenreToType, mapFetchedMovieToType } from '$lib';
import { type Collection, type FindCursor, type Document, type InsertManyResult, type InsertOneResult, ObjectId, type WithId } from 'mongodb';

export const movies: Collection<Movie> = db.collection<Movie>('movies');
export const genres: Collection<Genre> = db.collection<Genre>('genres');

/**
 * Adds a new movie to the 'movies' collection.
 * @param movieData - The data for the new movie.
 * @returns Promise<string> - Resolves with the ID of the added movie.
 */
export const addMovie = (movieData: any): Promise<string> => {
	return new Promise(async (resolve, reject) => {
		return movies.insertOne(movieData)
			.then((res: InsertOneResult<Movie>) => {
				if (res.acknowledged) {
					resolve(JSON.stringify(res));
				} else {
					reject(`Adding movie not acknowledged: ${res}`);
				}
			})
			.catch((err) => {
				reject(`Error adding movie: ${err}`);
			})
	});
};


/**
 * Adds a new genres to the 'genres' collection.
 * @param genresData - The genres to be added.
 * @returns Promise<string[]> - Resolves with the ID of the added genres.
 */
export const addGenres = (genresData: any): Promise<string[]> => {
	return new Promise(async (resolve, reject) => {
		let genreIds: string[] = [];
		console.log(`Initial genres: ${JSON.stringify(genresData)}`)
		try {
			const genresDocument: Document[] = await fetchDataFromMongoDB(genres)
			const mappedGenres: Genre[] = genresDocument.map((doc: Document) => mapFetchedGenreToType(doc))

			console.log(`Mapped genres: ${JSON.stringify(mappedGenres)}`)

			genresData.forEach(async (gData: Genre) => {
				console.log(`Reading genre: ${gData.name}`)
				const foundGenre: Genre | undefined = mappedGenres.find((g) => {
					const isTheSame: boolean = areStringsSimilar(gData.name, g.name)
					console.info(`Is ${gData.name} same with ${g.name} : ${isTheSame}`)
					return isTheSame
				})
				if (foundGenre) {
					console.info(`Found genre: ${gData.name}, adding to genreList`)
					genreIds = [...genreIds, foundGenre._id.toString()]
				} else {
					console.info(`New Genre: ${gData.name}, adding to collection`)
					const genreToBeAdded: any = {
						name: gData.name
					}
					await genres.insertOne(genreToBeAdded)
						.then((result) => {
							genreIds = [...genreIds, result.insertedId.toString()]
						})
				}
			});

			console.log('Done adding genres to collection')
			resolve(genreIds);
		} catch (error) {
			reject(error)
		}
	});
};


export const updateMovieByid = async (id: string, movie: Movie): Promise<boolean> => {
	return new Promise(async (resolve, reject) => {
		const movieDocuments: Document[] = await fetchDataFromMongoDB(movies, { _id: new ObjectId(id) })
		const mappedMovies: Movie[] = movieDocuments.map((doc: Document) => mapFetchedMovieToType(doc))
		const res: Movie | undefined = mappedMovies.find((m) => m.title === movie.title)
	});
}


export const fetchDataFromMongoDB = async (collection: any, options?: Record<string, any>): Promise<Document[]> => {
	const cursor: FindCursor<Document[]> = collection.find(options);
	return await cursor.toArray();
};

export const getDocumentById = async (collection: Collection<any>, id: string | undefined): Promise<Document> => {
	return new Promise(async (resolve, reject) => {
		if (id === undefined) {
			reject('Cannot find document, id is undefined')
		}
		resolve((await fetchDataFromMongoDB(collection, { _id: new ObjectId(id) }))[0])
	});
}