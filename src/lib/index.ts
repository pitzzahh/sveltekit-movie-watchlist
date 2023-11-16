export async function suggestGenre(value: string): Promise<string | null> {
	const lowercasedValue = value.toLowerCase();

	try {
		const response = await fetch('/api/genres');
		const genres = await response.json();
		console.log(genres);
		const similarGenres = genres.filter(
			(genre: string) => genre.includes(lowercasedValue) || lowercasedValue.includes(genre)
		);

		if (similarGenres.length > 0) {
			return similarGenres[0];
		}

		return null;
	} catch (error) {
		console.error('Error fetching genres:', error);
		return null;
	}
}

export const movieFormInfo = [
	{
		name: 'title',
		label: 'Title',
		description: 'The title of the movie'
	},
	{
		name: 'genre',
		label: 'Genre',
		description: 'The genre of the movie'
	},
	{
		name: 'year',
		label: 'Year of release',
		description: 'The year the movie was released'
	},
    {
        name: 'rating',
        label: 'Rating',
        description: 'The rating of the movie'
    },
    
];
