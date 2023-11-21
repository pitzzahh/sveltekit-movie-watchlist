import type { RequestHandler } from './$types';

import tf from '@tensorflow/tfjs';
import use from '@tensorflow-models/universal-sentence-encoder';

// Load the Universal Sentence Encoder model
const loadModel = async () => {
  return await use.load();
};

// Handle the POST request
export const POST: RequestHandler = async ({ request }) => {
  try {
    // Ensure the request method is POST
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // Parse the JSON body from the request
    const body = await request.json();
    
    // Ensure the required properties are present in the request body
    const { string1, string2 } = body;
    if (!string1 || !string2) {
      return new Response('Invalid request body', { status: 400 });
    }

    // Load the Universal Sentence Encoder model
    const model = await loadModel();

    // Embed the sentences
    const embeddings1 = await model.embed([string1]);
    const embeddings2 = await model.embed([string2]);
    
    // Convert Tensor2D to Tensor<Rank>
    const tensor1: tf.Tensor<tf.Rank> = embeddings1 as unknown as tf.Tensor<tf.Rank>;
    const tensor2: tf.Tensor<tf.Rank> = embeddings2 as unknown as tf.Tensor<tf.Rank>;
    
    // Calculate cosine similarity
    const similarity = tf.matMul(tensor1, tensor2, false, true).dataSync()[0];

    // Adjust the threshold as needed
    const threshold = 0.8; // Adjust as needed based on your use case

    // Construct the response based on the similarity result
    const responseText = similarity >= threshold ? 'Similar' : 'Not Similar';

    // Return the response
    return new Response(responseText, { status: 200 });
  } catch (error) {
    // Handle any errors that may occur
    console.error('Error processing request:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
