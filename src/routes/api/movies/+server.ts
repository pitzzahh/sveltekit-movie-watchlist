import { fetchDataFromMongoDB, movies } from '$db/collections';
import { mapFetchedMovieToType } from '$lib';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response(JSON.stringify((await fetchDataFromMongoDB(movies)).map((data) => mapFetchedMovieToType(data))), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};