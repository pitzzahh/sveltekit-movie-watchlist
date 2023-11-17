import type { PageServerLoad, Actions } from './$types';
import { movies } from '$db/collections';
import { error } from '@sveltejs/kit';

export const load = (async () => {
	try {
		const data = (await movies.find({}).toArray()).map((movie) => ({
			...movie,
			_id: movie._id.toString()
		}));

		return {
			status: data.length ? 200 : 404,
			movies: data
		};
	} catch (err: any) {
		throw error(500, `${err}`)
	}
}) satisfies PageServerLoad;