import type { PageServerLoad, Actions } from './$types';
import { movies } from '$db/collections';

export const load = (async () => {
	const data = (await movies.find({}).toArray()).map((movie) => ({
		...movie,
		_id: movie._id.toString()
	}));

	return {
		status: data.length ? 200 : 404,
		movies: data
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	deleteMovie: async (event) => {
		console.log('deleting movie');
		const data = await event.request.formData();
		const id = data.get('id');
		console.log(id);
	}
};
