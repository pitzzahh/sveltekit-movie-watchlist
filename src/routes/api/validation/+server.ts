import type { RequestHandler } from './$types';

import tensorFlow from '@tensorflow/tfjs-node';
import use from '@tensorflow-models/universal-sentence-encoder';

const loadModel = async () => {
	return await use.load();
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		if (request.method !== 'POST') {
			return new Response(JSON.stringify({ errorMessage: `Method not allowed` }), {
				status: 405,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST'
				}
			});
		}

		const body = await request.json();

		const { a, b } = body;
		if (!a || !b) {
			return new Response(JSON.stringify({ errorMessage: `Invalid Request Body` }), {
				status: 400,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST'
				}
			});
		}

		// Load the Universal Sentence Encoder model
		const model = await loadModel();

		// Embed the sentences
		const firstEmbed = await model.embed([a]);
		const secondEmbed = await model.embed([b]);

		// Convert Tensor2D to Tensor<Rank>
		const firstTensor: tensorFlow.Tensor<tensorFlow.Rank> =
			firstEmbed as unknown as tensorFlow.Tensor<tensorFlow.Rank>;
		const secondTensor: tensorFlow.Tensor<tensorFlow.Rank> =
			secondEmbed as unknown as tensorFlow.Tensor<tensorFlow.Rank>;

		// Calculate cosine similarity
		const similarity = tensorFlow.matMul(firstTensor, secondTensor, false, true).dataSync()[0];

		// Adjust the threshold as needed
		const threshold = 0.8; // Adjust as needed based on your use case

		// Return the response
		return new Response(JSON.stringify({ similar: similarity >= threshold }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'POST'
			}
		});
	} catch (error) {
		console.error('Error processing request:', error);
		return new Response(JSON.stringify({ errorMessage: `Error processing request: ${error}` }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'POST'
			}
		});
	}
};
