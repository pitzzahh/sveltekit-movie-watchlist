import type { PageServerLoad } from './$types';
import { movies } from '$db/movies';

export const load = (async () => {
	const data = await movies.find({})
    .toArray();
	return {
		status: 200,
		movies: data
	};
}) satisfies PageServerLoad;
