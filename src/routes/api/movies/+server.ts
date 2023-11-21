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
	allowedOrigins
} from '$lib';
import type { RequestHandler } from './$types';
import type { Document, InsertOneResult, MongoServerError, UpdateResult } from 'mongodb';
import { ObjectId } from 'mongodb';

export const GET: RequestHandler = async () => {
	return fetchDataFromMongoDB(movies)
		.then((movieDocuments: Document[]) =>
			Promise.all(
				movieDocuments
					.map((document: Document) => mapFetchedMovieToType(document))
					.map(async (movie) => {
						const movieGenres = movie.genres
							? await Promise.all(
									movie.genres.map(async (genreId: string) => {
										const genreDoc: Document = await getDocumentById(genres, genreId);
										const genre: Genre = mapFetchedGenreToType(genreDoc);
										return genre.name;
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
	console.log('Adding new movie');
	const requestBody = await request.json();
	const data: MovieDTO = {
		title: requestBody.title,
		genres: requestBody.genres,
		year: Number(requestBody.year),
		rating: Number(requestBody.rating),
		watched: false
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
					name: genre
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
	console.log('Deleting movie');
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
					JSON.stringify({ errorMesage: `Movie with id ${id} is not a movie document!` }),
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
					return new Response(JSON.stringify({ errorMesage: error.message }), {
						status: 500,
						headers: {
							'Access-Control-Allow-Origin': '*',
							'Access-Control-Allow-Methods': 'DELETE'
						}
					});
				});
		})
		.catch((error: MongoServerError) => {
			return new Response(
				JSON.stringify({ errorMesage: 'Cannot delete movie, it does not exist' }),
				{
					status: 404,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'DELETE'
					}
				}
			);
		});
};

export const PATCH: RequestHandler = async (event) => {
	const requestOrigin = event.request.headers.get('Origin');

	if (requestOrigin && !allowedOrigins.includes(requestOrigin)) {
		return new Response(
			JSON.stringify({ errorMesage: `Origin ${requestOrigin} is not authorized` }),
			{
				status: 401,
				headers: {
					'Access-Control-Allow-Origin': requestOrigin,
					'Access-Control-Allow-Methods': 'PATCH'
				}
			}
		);
	}

	const requestBody = await event.request.json();

	const genreArray: Genre[] = [];

	const genreString: string[] = requestBody.genres.split(' ');
	genreString.forEach((genre) => {
		genreArray.push({
			_id: '',
			name: genre
		});
	});

	const data: MovieDTO = {
		title: requestBody.title,
		genres: [],
		year: Number(requestBody.year),
		rating: Number(requestBody.rating),
		watched: false
	};

	return getDocumentById(movies, requestBody.data._id).then((document: Document) =>
		addGenres(genreArray)
			.then(async (genresId: string[]) => {
				data.genres = genresId;
				const result: UpdateResult<MovieDTO> = await movies.updateOne(
					{ _id: new ObjectId(requestBody.data._id) },
					{
						$set: data
					}
				);

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
				return new Response(
					JSON.stringify({
						movie: data,
						message: 'Movie updated'
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
					JSON.stringify({ errorMesage: `Failed to update movie ${data.title}: ${error.message}` }),
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
