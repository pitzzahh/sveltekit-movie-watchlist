type Movie = {
    id: string | null;
    title: string;
    genres: string[];
    year: number;
    rating: number;
    watched: boolean | false;
}

type Genre = {
    id: string | null;
    name: string;
}