import type { PageServerLoad } from './$types';
import { movies } from '$db/movies';
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./movie/schema";

export const load = (async () => {
	const data = await movies.find({})
    .toArray();
	return {
		status: 200,
		movies: data,
		form: superValidate(formSchema)
	};
}) satisfies PageServerLoad;
