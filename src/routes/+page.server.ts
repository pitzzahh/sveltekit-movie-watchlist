import type { PageServerLoad, Actions } from './$types';
import { movies } from '$db/collections';
import { startMongo } from '$db/mongo';
import { error } from '@sveltejs/kit';
export const prerender = true;

export const load = (async () => {
	try {
		await startMongo();

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