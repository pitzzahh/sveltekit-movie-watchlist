import { fetchDataFromMongoDB, movies, genres, getDocumentById } from '$db/collections';
import { mapFetchedMovieToType, mapFetchedGenreToType } from '$lib';
import type { RequestHandler } from './$types';
import type { Document } from 'mongodb';

export const GET: RequestHandler = async () => {
	const movieDocuments: Document[] = await fetchDataFromMongoDB(movies);
	const mappedMovies: Movie[] = movieDocuments.map((doc: Document) => mapFetchedMovieToType(doc))

	const finalMovies: Movie[] = await Promise.all(mappedMovies.map(async (m) => {
		const movieGenres = m.genres ? await Promise.all(m.genres.map(async (genreId: string) => {
			const genreDoc: Document = await getDocumentById(genres, genreId);
			const genre: Genre = mapFetchedGenreToType(genreDoc);
			return genre.name;
		})) : [];
		return { ...m, genres: movieGenres, _id: m._id };
	}));

	return new Response(JSON.stringify(finalMovies), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET'
		}
	});
};