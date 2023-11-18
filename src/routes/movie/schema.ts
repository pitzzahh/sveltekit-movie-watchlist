import { suggestGenre } from '$lib';
import { error } from '@sveltejs/kit';
import { z } from 'zod';

export const formSchema = z.object({
	title: z
		.string()
		.min(2, { message: 'Title must be at least 2 characters long' })
		.max(50, { message: 'Title cannot exceed 50 characters' }),
	genres: z
		.string()
		.min(3, { message: 'Genre must be at least 3 characters long' }),
	// .refine(
	// 	async (value) => {
	// 	  const suggestedGenre = await suggestGenre(value);

	// 	  if (suggestedGenre) {
	// 		throw error(400, `Do you mean ${suggestedGenre}?`);
	// 	  }

	// 	  return true;
	// 	},
	// 	{ message: 'Invalid genre' }
	//   ),
	year: z
		.string()
		.min(4, { message: 'Year must be at least 4 characters long' })
		.refine(
			(value) => {
				if (isNaN(Number(value))) {
					throw error(400, 'Year must be a number');
				}
				return Number(value) >= 1900 && Number(value) <= new Date().getFullYear();
			},
			{ message: 'Year must be between 1900 and current year' }
		),
	rating: z
		.string()
		.min(1, { message: 'Rating must be at least 1 characters long' })
		.max(10, { message: 'Rating cannot exceed 10 characters' }),
	movieId: z.string()
});

export type FormSchema = typeof formSchema;
