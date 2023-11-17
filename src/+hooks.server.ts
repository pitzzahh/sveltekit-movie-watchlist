import { startMongo } from '$db/mongo';
import { error } from '@sveltejs/kit';

startMongo()
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch((err: any) => {
		throw error(500, `${err}`);
	});
