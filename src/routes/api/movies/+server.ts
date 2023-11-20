import { fetchDataFromMongoDB, movies, genres, getDocumentById, addMovie, addGenres } from '$db/collections';
import { mapFetchedMovieToType, mapFetchedGenreToType, areStringsSimilar, allowedOrigins } from '$lib';
import type { RequestHandler } from './$types';
import type { Document, InsertOneResult, MongoServerError, UpdateResult } from 'mongodb';
import { ObjectId } from 'mongodb';
import { updateSchema } from '../../movie/[id]/schema';
import { superValidate } from 'sveltekit-superforms/server';

export const GET: RequestHandler = async () => {
	const movieDocuments: Document[] = await fetchDataFromMongoDB(movies);
	const mappedMovies: Movie[] = movieDocuments.map((doc: Document) => mapFetchedMovieToType(doc))

	const finalMovies: Movie[] = await Promise.all(mappedMovies.map(async (m) => {
		const movieGenres = m.genres ? await Promise.all(m.genres.map(async (genreId: string) => {
			const genreDoc: Document = await getDocumentById(genres, genreId);
			const genre: Genre = mapFetchedGenreToType(genreDoc);
			return genre.name;
		})) : [];
		return { ...m, genres: movieGenres, _id: m._id };
	}));

	return new Response(JSON.stringify(finalMovies), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET'
		}
	});
};

export const POST: RequestHandler = async ({ request }) => {

	const requestBody = await request.json()

	console.log('Adding new movie')
	console.log(`Request body: ${JSON.stringify(requestBody)}`)
	const data: MovieDTO = {
		title: requestBody.title,
		genres: requestBody.genres,
		year: Number(requestBody.year),
		rating: Number(requestBody.rating),
		watched: false
	}
	console.log(`Movie DTO: ${JSON.stringify(data)}`)

	return fetchDataFromMongoDB(movies)
		.then((movieDocuments: Document[]) => {
			const mappedMovies: Movie[] = movieDocuments.map((doc: Document) => mapFetchedMovieToType(doc))
			const res: Movie | undefined = mappedMovies.find((m) => areStringsSimilar(m.title, requestBody.title))

			if (res) {
				return new Response(JSON.stringify({ errorMessage: `Movie ${res.title} already exists` }), {
					status: 409,
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'POST'
					}
				});
			}

			const genres:GenreDTO[] = data.genres.map((genre) => {
				return {
					name: genre
				}
			})

			return addGenres(genres)
				.then(async (genreResult: string[]) => {
					data.genres = genreResult
					return addMovie(data)
						.then((response: string) => {
							let res: InsertOneResult<Movie> = JSON.parse(response);

							const isAcknowledged = res.acknowledged;
							const insertedId = res.insertedId.toString();

							console.log(`Inserted movie result: ${JSON.stringify(res)}`)
							if (!isAcknowledged) {
								return new Response(JSON.stringify({ errorMessage: `Failed to add movie ${data.title}` }), {
									status: 400,
									headers: {
										'Access-Control-Allow-Origin': '*',
										'Access-Control-Allow-Methods': 'POST'
									}
								});
							}

							return new Response(JSON.stringify({
								insertedData: { ...data, _id: insertedId },
								message: `Movie ${data.title} added to watchlist`
							}), {
								status: 201,
								headers: {
									'Content-Type': 'application/json',
									'Access-Control-Allow-Origin': '*',
									'Access-Control-Allow-Methods': 'POST'
								}
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
						})
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
		}).catch((error: MongoServerError) => {
			return new Response(JSON.stringify({ errorMessage: error.message }), {
				status: error.code ? Number(error.code) : 500,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST'
				}
			});
		})
}

export const DELETE: RequestHandler = async ({ request }) => {

	const requestBody = await request.json()
	console.log(`Deleting movie, response: ${JSON.stringify(requestBody)}`)
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
				return new Response(JSON.stringify({ errorMesage: `Movie with id ${id} is not a movie document!` }), {
					status: 400,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'DELETE'
					}
				});
			}

			return movies.deleteOne({ _id: new ObjectId(id) })
				.then((response: Document) => {
					const isAcknowledged = response.acknowledged;
					const deleteCount = response.deletedCount;
					const isDeleted = deleteCount === 1;
					const isValid = isAcknowledged && isDeleted;

					console.log(`is acknowledged: ${response.acknowledged}`)
					console.log(`Delete count: ${deleteCount}`)

					if (!isValid) {
						return new Response(JSON.stringify({ errorMessage: `Request is ${isAcknowledged ? 'acknowledged' : 'not acknowledged'}, movie is ${isDeleted ? 'deleted' : 'not deleted'}  ` }), {
							status: 400,
							headers: {
								'Access-Control-Allow-Origin': '*',
								'Access-Control-Allow-Methods': 'DELETE'
							}
						});
					}

					const movie: Movie | undefined = mapFetchedMovieToType(fetchedMovie);
					return new Response(JSON.stringify({
						deletedMovie: movie,
						message: `Movie  ${movie.title} removed sucessfully`
					}), {
						status: 200,
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
							'Access-Control-Allow-Methods': 'DELETE'
						}
					});
				}).catch((error: MongoServerError) => {
					return new Response(JSON.stringify({ errorMesage: error.message }), {
						status: 500,
						headers: {
							'Access-Control-Allow-Origin': '*',
							'Access-Control-Allow-Methods': 'DELETE'
						}
					});
				})
		}).catch((error: MongoServerError) => {
			return new Response(JSON.stringify({ errorMesage: 'Cannot delete movie, it does not exist' }), {
				status: 404,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'DELETE'
				}
			});
		})
}

export const PATCH: RequestHandler = async (event) => {

	console.log('modifying movie data..');
	const form = await superValidate(event, updateSchema, {
		id: 'updateSchema'
	});
	console.log(`Request Headers: ${JSON.stringify(event.request.headers)}`)
	const requestOrigin = event.request.headers.get('Origin');

	if (requestOrigin && !allowedOrigins.includes(requestOrigin)) {
		return new Response(JSON.stringify({ errorMesage: `Origin ${requestOrigin} is not authorized` }), {
			status: 401,
			headers: {
				'Access-Control-Allow-Origin': requestOrigin,
				'Access-Control-Allow-Methods': 'PATCH'
			}
		});
	}

	console.log(`Is modified movie data valid: ${form.valid}`);
	if (!form.valid) {
		return new Response(JSON.stringify({ errorMesage: form.message }), {
			status: 406,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'PATCH'
			}
		});
	}

	const genreArray: Genre[] = [];

	const genreString: string[] = form.data.genres.split(' ');
	genreString.forEach((genre) => {
		genreArray.push({
			_id: '',
			name: genre
		});
	});

	const requestBody = await event.request.json()

	const data: MovieDTO = {
		title: requestBody.title,
		genres: [],
		year: Number(requestBody.year),
		rating: Number(requestBody.rating),
		watched: false
	}

	return getDocumentById(movies, requestBody.data._id)
		.then(async (_fetchedMovie: Document) => {
			const genreResult = await addGenres(genreArray);
			return addGenres(genreArray)
				.then(async(genresId: string[]) => {
					data.genres = genresId
					const result: UpdateResult<MovieDTO> = await movies.updateOne(
						{ _id: new ObjectId(requestBody.data._id) },
						{
							$set: data
						});
	
					const isAcknowledged = result.acknowledged;
					const modifiedCount = result.modifiedCount;
					const isUpdated = modifiedCount === 1;
					const isValid = isAcknowledged && isUpdated;
	
					if (!isValid) {
						return new Response(JSON.stringify({ errorMessage: `Request is ${isAcknowledged ? 'acknowledged' : 'not acknowledged'}, movie is ${isUpdated ? 'updated' : 'not updated'}  ` }), {
							status: 400,
							headers: {
								'Access-Control-Allow-Origin': '*',
								'Access-Control-Allow-Methods': 'PATCH'
							}
						});
					}
					return new Response(JSON.stringify({
						form,
						movie: data,
						message: 'Movie updated'
					}), {
						status: 202,
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
							'Access-Control-Allow-Methods': 'PATCH'
						}
					});
				}).catch((error: MongoServerError) => {
					return new Response(JSON.stringify({ errorMesage: `Failed to update movie ${data.title}: ${error.message}` }), {
						status: 400,
						headers: {
							'Access-Control-Allow-Origin': '*',
							'Access-Control-Allow-Methods': 'PATCH'
						}
					});
				})
		});
}
