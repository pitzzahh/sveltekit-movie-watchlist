import db from '$db/mongo';

export const movies = db.collection<Movie>('movies');