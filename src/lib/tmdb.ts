import { MovieDb } from "moviedb-promise";

const moviedb = new MovieDb(process.env.TMDB_API_KEY || "");

export const search = async (query: string) => {
	const response = await moviedb.searchMovie({ query });
	const data = response.results;
	return data;
};

export const external_ids = async (id: number) => {
	const response = await moviedb.movieExternalIds(id);
	return response;
};
