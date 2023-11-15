import { MongoClient, ServerApiVersion } from 'mongodb';
import { MONGO_URL } from '$env/static/private';

const client = new MongoClient(MONGO_URL, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true
	}
});

export function startMongo(): Promise<MongoClient> {
	console.log('Connecting to MongoDB...');
	return client.connect();
}

export default client.db();
