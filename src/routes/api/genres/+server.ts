import { fetchDataFromMongoDB, genres } from '$db/collections';
import { mapFetchedGenreToType } from '$lib';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response(JSON.stringify((await fetchDataFromMongoDB(genres)).map((data) => mapFetchedGenreToType(data))), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
