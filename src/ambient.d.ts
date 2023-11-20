type Movie = {
    _id: string;
    title: string;
    genres: string[] | [];
    year: number;
    rating: number;
    watched: boolean | false;
}

type MovieDTO = {
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

type GenreDTO = {
    name: string;
}