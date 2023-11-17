type Movie = {
    id: string | null;
    title: string;
    genres: Genre[];
    year: number;
    rating: number;
    watched: boolean | false;
}

type Genre = {
    id: string | null;
    name: string;
}