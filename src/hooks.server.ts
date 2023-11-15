import { startMongo } from '$db/mongo';
import type { MongoError } from 'mongodb';

startMongo()
	.then(() => {
		console.log('MongoDB connected');
	})
	.catch((err: MongoError) => {
		console.error('MongoDB connection failed');
		console.error(err);
		process.exit(1);
	});
