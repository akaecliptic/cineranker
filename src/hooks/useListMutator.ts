import { Dispatch, SetStateAction, useCallback, useMemo, useRef } from "react";
import { MovieExternalIdsResponse, MovieResult } from "moviedb-promise";

import type { DatabaseEntry } from "types/auxil";

type Dispatcher = Dispatch<SetStateAction<DatabaseEntry<"Movies">[] | undefined>>;

export type ListMutator = {
	addMovie: (movie: MovieResult) => void;
	toggleDelete: (value: number) => void;
	submitDeleteQueue: () => Set<number>;
};

const fetchExternalIds = async (id: number | undefined): Promise<string> => {
	if (!id) return "0";

	const response = await fetch(`${window.location.origin}/api/tmdb/externals?id=${id}`);

	if (!response.ok) {
		const error = await response.json();
		console.warn("Error fetching external movie ids: '%s'", error.message);
		return "0";
	}

	const json = await response.json();
	const data = json ? (json as MovieExternalIdsResponse) : null;
	return data?.imdb_id || "0";
};

export const useListMutator = (dispatcher: Dispatcher): ListMutator => {
	const deleteQueue = useMemo<Set<number>>(() => new Set(), []);
	const removedItems = useRef<Set<number>>(new Set());

	const addMovie = useCallback(
		(movie: MovieResult): void => {
			removedItems.current.delete(movie.id!);
			deleteQueue.delete(movie.id!);

			fetchExternalIds(movie.id).then((imdb_id) => {
				const year = movie.release_date ? parseInt(movie.release_date.split("-")[0]) : 2752;
				const insert: DatabaseEntry<"Movies"> = {
					tmdb_id: movie.id!,
					title: movie.title!,
					year: year,
					imdb_id: imdb_id,
					poster: movie.poster_path!,
				};

				dispatcher((old) => (old ? [...old, insert] : [insert]));
			});
		},
		[dispatcher, deleteQueue, removedItems]
	);

	const toggleDelete = useCallback(
		(value: number): void => {
			if (!deleteQueue.delete(value)) deleteQueue.add(value);
		},
		[deleteQueue]
	);

	const submitDeleteQueue = useCallback((): Set<number> => {
		dispatcher((old) => {
			if (!old) return [];
			const filtered = old.filter((movie) => {
				if (deleteQueue.has(movie.tmdb_id)) removedItems.current.add(movie.tmdb_id);
				return !deleteQueue.has(movie.tmdb_id);
			});
			return filtered;
		});
		return removedItems.current;
	}, [dispatcher, deleteQueue, removedItems]);

	return { addMovie, toggleDelete, submitDeleteQueue };
};
