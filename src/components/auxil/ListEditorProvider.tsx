"use client";

import { FC, PropsWithChildren, createContext, useContext, useRef, useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";

import { useSupabase } from "components/auxil/SupabaseProvider";

import type { DatabaseEntry } from "types/auxil";
import type { MovieExternalIdsResponse, MovieResult } from "moviedb-promise";

type ListMutators = {
	addMovie: (value: MovieResult) => void;
	setList: (value: DatabaseEntry<"Movies">[]) => void;
	toggleDelete: (value: number) => void;
	submitDeleteQueue: () => void;
};

type EditorContext = {
	working: string;
	title: string;
	setTitle: (value: string) => void;
	list: DatabaseEntry<"Movies">[];
	saveList: () => Promise<boolean>;
	deleteQueue: Set<number>;
	listMutators: ListMutators;
};

type PropListEditorProvider = {
	working: string;
	data: [string, DatabaseEntry<"Movies">[]];
};

const Context = createContext<EditorContext | undefined>(undefined);

const EditListProvider: FC<PropsWithChildren<PropListEditorProvider>> = ({
	children,
	working,
	data,
}) => {
	const deleted = useRef<Set<number>>(new Set());

	const [title, setTitle] = useState<string>(data[0]);
	const [list, setList] = useState<DatabaseEntry<"Movies">[]>(data[1]);
	const [deleteQueue, setDeleteQueue] = useState<Set<number>>(new Set());

	const { supabase, session } = useSupabase();

	const addMovie = (movie: MovieResult) => {
		const year = movie.release_date ? parseInt(movie.release_date.split("-")[0]) : 2752;
		const insert: DatabaseEntry<"Movies"> = {
			tmdb_id: movie.id!,
			title: movie.title!,
			year: year,
			imdb_id: "0",
			poster: movie.poster_path!,
		};

		setList((old) => [...old, insert]);
	};

	const toggleDelete = (value: number) => {
		setDeleteQueue((old) => {
			if (deleteQueue.has(value)) {
				old.delete(value);
			} else {
				old.add(value);
			}
			return new Set([...old]);
		});
	};

	const submitDeleteQueue = () => {
		const filtered = list.filter((movie) => {
			if (deleteQueue.has(movie.tmdb_id)) deleted.current.add(movie.tmdb_id);

			return !deleteQueue.has(movie.tmdb_id);
		});
		setList([...filtered]);
		setDeleteQueue(new Set());
	};

	const saveList = async (): Promise<boolean> => {
		if (list.length === 0 || title === "" || session === null) return false;

		const userId = session.user.id;

		await getExternalIds();

		const { error: movieUpsertError } = await supabase
			.from("Movies")
			.upsert(
				list.map((item) => {
					/*
						The items operated may not be pure DatabaseEntry<"Movies">;
						If queried from an existing list, they also carry a 'rank' and 'list' field for easier house keeping.
						
						These are removed here to ensure the data to upsert is in the correct format.  
					*/
					const movie = { ...item } as any;
					delete movie.rank;
					delete movie.list;
					return movie;
				})
			)
			.select();

		if (movieUpsertError) {
			console.error("Error updating movies, with code:", movieUpsertError.code);
			return false;
		}

		const { error: listUpsertError } = await supabase
			.from("Lists")
			.upsert({ _id: parseInt(working), title: title, user_id: userId });

		if (listUpsertError) {
			console.error("Error updating list, with code:", listUpsertError.code);
			return false;
		}

		const insertData = list.map((item, index) => ({
			list_id: parseInt(working),
			movie_id: item.tmdb_id,
			rank: index + 1,
			user_id: userId,
		})) as DatabaseEntry<"Lists_To_Movies", "Insert">[];

		const linkingError = await linkListToMovies(insertData);

		if (linkingError[0] !== null) {
			console.error("Error updating movies in list, with code:", linkingError[0].code);
			return false;
		} else if (linkingError[1] !== null) {
			console.error("Error deleteing movies from list, with code:", linkingError[1].code);
			return false;
		}

		return true;
	};

	const getExternalIds = async () => {
		const ids = list.flatMap((item) => (item.imdb_id === "0" ? item.tmdb_id : [])).join(",");

		if (ids.replace(/\s/g, "") != "") {
			const response = await fetch(`http://localhost:3000/api/tmdb/externals?ids=${ids}`);
			const externals: MovieExternalIdsResponse[] | null = await response.json();

			if (externals !== null) {
				for (let i = 0; i < list.length; i++) {
					const looking = list[i].tmdb_id;
					const found = externals.filter((ext) => ext.id === looking);
					if (found.length === 0) continue;

					list[i].imdb_id = found[0].imdb_id!;
				}
			}
		}
	};

	const linkListToMovies = async (
		insert: DatabaseEntry<"Lists_To_Movies", "Insert">[]
	): Promise<(PostgrestError | null)[]> => {
		const { error: insertError } = await supabase.from("Lists_To_Movies").upsert(insert);
		const { error: deleteError } = await supabase
			.from("Lists_To_Movies")
			.delete()
			.eq("list_id", working)
			.in("movie_id", [...deleted.current]);

		return [insertError, deleteError];
	};

	return (
		<Context.Provider
			value={{
				working,
				title,
				list,
				setTitle,
				saveList,
				deleteQueue,
				listMutators: { addMovie, submitDeleteQueue, setList, toggleDelete },
			}}>
			<>{children}</>
		</Context.Provider>
	);
};

export const useEditor = () => {
	const context = useContext(Context);

	if (!context) throw new Error("useEditor must be used inside EditListProvider");

	return context;
};

export default EditListProvider;
