import { startMongo } from '$db/mongo';
import { error } from '@sveltejs/kit';
import type { MongoServerError } from 'mongodb';

startMongo()
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch((err: MongoServerError) => {
		throw error(err.code ? Number(err.code) : 500, `${err.message}`);
	});
