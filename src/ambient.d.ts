type Movie = {
    _id: string;
    title: string;
    genres: string[] | [];
    year: number;
    rating: number;
    watched: boolean | false;
}

type Genre = {
    _id: string;
    name: string;
}