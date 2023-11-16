import { error } from '@sveltejs/kit';
import { suggestGenre } from '$lib'
import { z } from 'zod';

export const formSchema = z.object({
	title: z
		.string()
		.min(2, { message: 'Title must be at least 2 characters long' })
		.max(50, { message: 'Title cannot exceed 50 characters' }),
	genre: z
		.string()
		.min(4, { message: 'Genre must be at least 4 characters long' })
		.max(10, { message: 'Genre cannot exceed 10 characters' }),
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
		)
});

export type FormSchema = typeof formSchema;
