import {
	fetchDataFromMongoDB,
	movies,
	genres,
	getDocumentById,
	addMovie,
	addGenres
} from '$db/collections';
import {
	mapFetchedMovieToType,
	mapFetchedGenreToType,
	areStringsSimilar,
	toPascalCase
} from '$lib';

import type { RequestHandler } from './$types';
import type { Document, InsertOneResult, MongoServerError, UpdateResult } from 'mongodb';
import { ObjectId } from 'mongodb';

export const GET: RequestHandler = async ({ request }) => {
	console.log('GET request to api/movies');

	return fetchDataFromMongoDB(movies)
		.then((movieDocuments: Document[]) =>
			Promise.all(
				movieDocuments
					.map((document: Document) => mapFetchedMovieToType(document))
					.map(async (movie) => {
						const movieGenres = movie.genres
							? await Promise.all(
									movie.genres.map(async (genreId: string) => {
										return getDocumentById(genres, genreId)
											.then((genreDoc: Document) => mapFetchedGenreToType(genreDoc).name)
											.catch(() => 'NotFound');
									})
							  )
							: [];
						return { ...movie, genres: movieGenres, _id: movie._id };
					})
			)
				.then((movies: Movie[]) => {
					if (!movies) {
						return new Response(JSON.stringify(movies), {
							status: 404,
							headers: {
								'Content-Type': 'application/json',
								'Access-Control-Allow-Origin': '*',
								'Access-Control-Allow-Methods': 'GET'
							}
						});
					}

					return new Response(JSON.stringify(movies), {
						status: 200,
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
							'Access-Control-Allow-Methods': 'GET'
						}
					});
				})
				.catch((err: MongoServerError) => {
					return new Response(JSON.stringify({ errorMessage: err.message }), {
						status: err.code ? Number(err.code) : 500,
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
							'Access-Control-Allow-Methods': 'GET'
						}
					});
				})
		)
		.catch((err: MongoServerError) => {
			return new Response(JSON.stringify({ errorMessage: err.message }), {
				status: err.code ? Number(err.code) : 500,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET'
				}
			});
		});
};

export const POST: RequestHandler = async ({ request }) => {
	console.log('POST request to api/movies');

	const requestBody = await request.json();
	const data: MovieDTO = {
		title: requestBody.title,
		genres: requestBody.genres,
		year: Number(requestBody.year),
		rating: Number(requestBody.rating),
		watched: requestBody.watched
	};

	console.log(`POST Request body in api/movies: ${JSON.stringify(requestBody)}`);
	return fetchDataFromMongoDB(movies)
		.then((movieDocuments: Document[]) => {
			const mappedMovies: Movie[] = movieDocuments.map((doc: Document) =>
				mapFetchedMovieToType(doc)
			);
			const res: Movie | undefined = mappedMovies.find((movie: Movie) =>
				areStringsSimilar(requestBody.title, movie.title)
			);
			console.log(`Movie that is found similar: ${JSON.stringify(res)}`);
			if (res) {
				return new Response(
					JSON.stringify({ errorMessage: `Movie ${data.title} already exists` }),
					{
						status: 409,
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
							'Access-Control-Allow-Methods': 'POST'
						}
					}
				);
			}

			const genres: GenreDTO[] = data.genres.map((genre) => {
				return {
					name: toPascalCase(genre)
				};
			});

			return addGenres(genres)
				.then(async (genreResult: string[]) => {
					data.genres = genreResult;
					return addMovie(data)
						.then((response: string) => {
							let res: InsertOneResult<Movie> = JSON.parse(response);

							const isAcknowledged = res.acknowledged;
							const insertedId = res.insertedId.toString();

							if (!isAcknowledged) {
								return new Response(
									JSON.stringify({ errorMessage: `Failed to add movie ${data.title}` }),
									{
										status: 400,
										headers: {
											'Access-Control-Allow-Origin': '*',
											'Access-Control-Allow-Methods': 'POST'
										}
									}
								);
							}

							return new Response(
								JSON.stringify({
									insertedData: { ...data, _id: insertedId },
									message: `Movie ${data.title} added to watchlist`
								}),
								{
									status: 201,
									headers: {
										'Content-Type': 'application/json',
										'Access-Control-Allow-Origin': '*',
										'Access-Control-Allow-Methods': 'POST'
									}
								}
							);
						})
						.catch((error: MongoServerError) => {
							return new Response(JSON.stringify({ errorMessage: error.message }), {
								status: error.code ? Number(error.code) : 500,
								headers: {
									'Content-Type': 'application/json',
									'Access-Control-Allow-Origin': '*',
									'Access-Control-Allow-Methods': 'POST'
								}
							});
						});
				})
				.catch((error: MongoServerError) => {
					return new Response(JSON.stringify({ errorMessage: error.message }), {
						status: error.code ? Number(error.code) : 500,
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
							'Access-Control-Allow-Methods': 'POST'
						}
					});
				});
		})
		.catch((error: MongoServerError) => {
			return new Response(JSON.stringify({ errorMessage: error.message }), {
				status: error.code ? Number(error.code) : 500,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST'
				}
			});
		});
};

export const DELETE: RequestHandler = async ({ request }) => {
	console.log('DELETE request to api/movies');

	try {
		const requestBody = await request.json();
		const id = requestBody.id;
		if (!id) {
			return new Response(JSON.stringify({ errorMessage: 'No movie id specified' }), {
				status: 404,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'DELETE'
				}
			});
		}
		return getDocumentById(movies, id)
			.then((fetchedMovie: Document) => {
				if (!fetchedMovie) {
					return new Response(
						JSON.stringify({ errorMessage: `Movie with id ${id} is not a movie document!` }),
						{
							status: 400,
							headers: {
								'Access-Control-Allow-Origin': '*',
								'Access-Control-Allow-Methods': 'DELETE'
							}
						}
					);
				}

				return movies
					.deleteOne({ _id: new ObjectId(id) })
					.then((response: Document) => {
						const isAcknowledged = response.acknowledged;
						const deleteCount = response.deletedCount;
						const isDeleted = deleteCount === 1;
						const isValid = isAcknowledged && isDeleted;

						console.log(`is acknowledged: ${response.acknowledged}`);
						console.log(`Delete count: ${deleteCount}`);

						if (!isValid) {
							return new Response(
								JSON.stringify({
									errorMessage: `Request is ${
										isAcknowledged ? 'acknowledged' : 'not acknowledged'
									}, movie is ${isDeleted ? 'deleted' : 'not deleted'}  `
								}),
								{
									status: 400,
									headers: {
										'Access-Control-Allow-Origin': '*',
										'Access-Control-Allow-Methods': 'DELETE'
									}
								}
							);
						}

						const movie: Movie | undefined = mapFetchedMovieToType(fetchedMovie);
						return new Response(
							JSON.stringify({
								deletedMovie: movie,
								message: `Movie ${movie.title} removed sucessfully`
							}),
							{
								status: 200,
								headers: {
									'Content-Type': 'application/json',
									'Access-Control-Allow-Origin': '*',
									'Access-Control-Allow-Methods': 'DELETE'
								}
							}
						);
					})
					.catch((error: MongoServerError) => {
						return new Response(JSON.stringify({ errorMessage: error.message }), {
							status: 500,
							headers: {
								'Access-Control-Allow-Origin': '*',
								'Access-Control-Allow-Methods': 'DELETE'
							}
						});
					});
			})
			.catch(
				() =>
					new Response(
						JSON.stringify({
							errorMessage: `Cannot delete movie, movie with id ${id} does not exist`
						}),
						{
							status: 404,
							headers: {
								'Access-Control-Allow-Origin': '*',
								'Access-Control-Allow-Methods': 'DELETE'
							}
						}
					)
			);
	} catch {
		return new Response(JSON.stringify({ errorMessage: 'Cannot delete movie, invalid body' }), {
			status: 404,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'DELETE'
			}
		});
	}
};

export const PATCH: RequestHandler = async ({ request }) => {
	console.log('PATCH request to api/movies');

	const requestBody: Movie = await request.json();

	console.log(`Request body in PATH: ${JSON.stringify(requestBody)}`);
	const genres: GenreDTO[] = [];

	requestBody.genres.forEach((genre: string) => {
		genres.push({
			name: genre
		});
	});

	const data: MovieDTO = {
		title: requestBody.title,
		genres: [],
		year: Number(requestBody.year),
		rating: Number(requestBody.rating),
		watched: requestBody.watched
	};

	console.log(`Genres DTO: ${JSON.stringify(genres)}`);
	return getDocumentById(movies, requestBody._id).then((document: Document) =>
		addGenres(genres)
			.then(async (genresId: string[]) => {
				data.genres = genresId;
				const filter = { _id: new ObjectId(requestBody._id) };

				const update = {
					$set: {
						title: data.title,
						genres: data.genres,
						year: data.year,
						rating: data.rating,
						watched: data.watched
					}
				};
				const oldMovie: Movie | undefined = mapFetchedMovieToType(document);
				const result: UpdateResult<Movie> = await movies.updateOne(filter, update);

				const isAcknowledged = result.acknowledged;
				const modifiedCount = result.modifiedCount;
				const isUpdated = modifiedCount === 1;
				const isValid = isAcknowledged && isUpdated;

				if (!isValid) {
					return new Response(
						JSON.stringify({
							errorMessage: `Request is ${
								isAcknowledged ? 'acknowledged' : 'not acknowledged'
							}, movie is ${isUpdated ? 'updated' : 'not updated'}  `
						}),
						{
							status: 400,
							headers: {
								'Access-Control-Allow-Origin': '*',
								'Access-Control-Allow-Methods': 'PATCH'
							}
						}
					);
				}
				const message = areStringsSimilar(oldMovie?.title, data.title)
					? 'Movie updated sucessfully'
					: `Movie ${oldMovie?.title} updated to ${data.title}`;
				return new Response(
					JSON.stringify({
						movie: data,
						message
					}),
					{
						status: 202,
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
							'Access-Control-Allow-Methods': 'PATCH'
						}
					}
				);
			})
			.catch((error: MongoServerError) => {
				return new Response(
					JSON.stringify({
						errorMessage: `Failed to update movie ${data.title}: ${error.message}`
					}),
					{
						status: 400,
						headers: {
							'Access-Control-Allow-Origin': '*',
							'Access-Control-Allow-Methods': 'PATCH'
						}
					}
				);
			})
	);
};
