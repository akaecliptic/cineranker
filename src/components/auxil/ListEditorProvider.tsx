"use client";

import { FC, PropsWithChildren, createContext, useContext, useRef, useState } from "react";

import { useSupabase } from "components/auxil/SupabaseProvider";

import type { DatabaseEntry, ToastyPayload } from "types/auxil";

type DialogController = {
	showDialog: boolean;
	setShowDialog: (value: boolean) => void;
};

type EditorContext = {
	working: string;
	updateTitle: (value: string) => void;
	updateList: (value: DatabaseEntry<"Movies">[]) => void;
	updateDeleted: (value: Set<number>) => void;
	submitSaveList: () => Promise<ToastyPayload>;
	dialogController: DialogController;
	listCap: number;
};

type PropListEditorProvider = {
	working: string;
};

type MovieInsert = DatabaseEntry<"Lists_To_Movies", "Insert">;

const Context = createContext<EditorContext | undefined>(undefined);

const EditListProvider: FC<PropsWithChildren<PropListEditorProvider>> = ({ children, working }) => {
	const deleted = useRef<Set<number>>(new Set());
	const title = useRef<string>("");
	const list = useRef<DatabaseEntry<"Movies">[]>([]);
	const [showDialog, setShowDialog] = useState<boolean>(false);

	const { supabase, session } = useSupabase();

	const LIST_CAP = 9;

	// REFERENCE UPDATING

	const updateTitle = (value: string) => {
		title.current = value;
	};

	const updateList = (value: DatabaseEntry<"Movies">[]) => {
		list.current = value;
	};

	const updateDeleted = (value: Set<number>) => {
		deleted.current = value;
	};

	// DATABASE INTERACTIONS

	const linkListToMovies = async (insert: MovieInsert[]): Promise<boolean> => {
		const { error } = await supabase.from("Lists_To_Movies").upsert(insert);

		if (error !== null) {
			console.error("Error updating movies in list, with code:", error.code);
			return false;
		}

		return true;
	};

	const unlinkListToMovies = async (): Promise<boolean> => {
		const { error } = await supabase
			.from("Lists_To_Movies")
			.delete()
			.eq("list_id", working)
			.in("movie_id", [...deleted.current]);

		if (error !== null) {
			console.error("Error deleteing movies from list, with code:", error.code);
			return false;
		}

		deleted.current.clear();
		return true;
	};

	const upsertList = async (userId: string): Promise<boolean> => {
		const { error } = await supabase
			.from("Lists")
			.upsert({ _id: parseInt(working), title: title.current, user_id: userId });

		if (error) {
			console.error("Error updating list, with code:", error.code);
			return false;
		}

		return true;
	};

	const upsertMovies = async (): Promise<boolean> => {
		/*
			The items operated may not be pure DatabaseEntry<"Movies">;
			If queried from an existing list, they also carry a 'rank' and 'list' field for easier house keeping.
			
			These are removed here to ensure the data to upsert is in the correct format.  
		*/
		const formattedList = list.current.map((item) => {
			// TODO: Change this logic.
			// Not a fan of this at all, but it will do.
			const movie = { ...item } as any;
			delete movie.rank;
			delete movie.list;
			return movie;
		});

		const { error } = await supabase.from("Movies").upsert(formattedList);

		if (error) {
			console.error("Error updating movies, with code:", error.code);
			return false;
		}

		return true;
	};

	const saveList = async (): Promise<boolean> => {
		if (list.current.length === 0 || title.current === "" || session === null) return false;

		const userId = session.user.id;

		const upsertMoviesResponse = await upsertMovies();
		if (!upsertMoviesResponse) return false;

		const upsertListResponse = await upsertList(userId);
		if (!upsertListResponse) return false;

		const insertData = list.current.map((item, index) => ({
			list_id: parseInt(working),
			movie_id: item.tmdb_id,
			rank: index + 1,
			user_id: userId,
		})) as DatabaseEntry<"Lists_To_Movies", "Insert">[];

		const linkingResponse = await linkListToMovies(insertData);
		if (!linkingResponse) return false;

		const unlinkingResponse = await unlinkListToMovies();
		return unlinkingResponse;
	};

	const submitSaveList = async (): Promise<ToastyPayload> => {
		if (title.current.replace(/\s/g, "") === "") {
			return ["Invalid list title", "alert"];
		} else if (list.current.length === 0) {
			return ["List cannot be empty", "alert"];
		}

		const saved = await saveList();
		return saved ? ["List saved", "info"] : ["List failed to save", "alert"];
	};

	return (
		<Context.Provider
			value={{
				working,
				updateTitle,
				updateList,
				updateDeleted,
				submitSaveList,
				dialogController: {
					showDialog,
					setShowDialog,
				},
				listCap: LIST_CAP,
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
