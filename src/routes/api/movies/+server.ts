import { movies } from '$db/collections';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const data = (await movies.find({}).toArray()).map(movie => ({
		...movie,
		_id: movie._id.toString()
	  }));
	
	return new Response(JSON.stringify(data), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};