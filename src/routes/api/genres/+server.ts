import type { RequestHandler } from './$types';

const genres = [
	'horror',
	'action',
	'comedy',
	'drama',
	'science_fiction',
	'romance',
	'thriller',
	'fantasy'
];

export const GET: RequestHandler = async () => {
	return new Response(JSON.stringify(genres), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
