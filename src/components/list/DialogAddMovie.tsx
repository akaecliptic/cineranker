"use client";

import { FC, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MovieResult } from "moviedb-promise";

import type { DatabaseEntry } from "types/auxil";

import { useEditor } from "components/auxil/ListEditorProvider";
import Dialog from "components/ui/Dialog";

type PropSearchItem = {
	movie: MovieResult;
	onClick: (self: MovieResult) => void;
};

const SearchItem: FC<PropSearchItem> = ({ movie, onClick }) => {
	return (
		<div className='search-item' onClick={() => onClick(movie)}>
			<span>{movie.title}</span>
			<span>({movie.release_date ? movie.release_date.split("-")[0] : "2752"})</span>
		</div>
	);
};

export type PropDialogAddMovie = {
	list: DatabaseEntry<"Movies">[];
	addMovie: (movie: MovieResult) => void;
};

const DialogAddMovie: FC<PropDialogAddMovie> = ({ list, addMovie }) => {
	const {
		dialogController: { showDialog, setShowDialog: setShowDialog },
		listCap,
	} = useEditor();

	const [query, setQuery] = useState<string>("");
	const [searchItems, setSearchItems] = useState<MovieResult[]>([]);
	const [emptySearch, setEmptySearch] = useState<boolean>(false);

	const submitQuery = async () => {
		if (query.replace(/\s/g, "") === "") return;

		const response = await fetch(
			`${window.location.origin}/api/tmdb?search=${encodeURI(query)}`
		);
		const data: MovieResult[] | null = await response.json();

		if (data !== null) {
			setSearchItems(() => [...data]);
		}

		setEmptySearch(data === null || data.length === 0);
	};

	const cleanupSearch = () => {
		setQuery("");
		setSearchItems([]);
		setShowDialog(false);
	};

	const onItemClickHandler = (self: MovieResult) => {
		if (list.length === listCap) {
			alert(`Current list capacity is ${listCap}`);
			return;
		}

		const filtered = list.filter((item) => item.tmdb_id === self.id);
		if (filtered.length > 0) return;

		addMovie(self);
	};

	return (
		<Dialog show={showDialog} onClose={cleanupSearch}>
			<div className='container-searchbar'>
				<input
					type='search'
					name='searchbar'
					title='search-movie'
					id='searchbar'
					onKeyDown={(event) => event.key === "Enter" && submitQuery()}
					onChange={(event) => setQuery(event.currentTarget.value)}
				/>
				<button onClick={submitQuery}>
					<FaSearch />
				</button>
			</div>
			<div className='container-search-items'>
				{emptySearch ? (
					<span className='search-message'>No Results Found</span>
				) : (
					searchItems.map((item) => (
						<SearchItem key={item.id} movie={item} onClick={onItemClickHandler} />
					))
				)}
			</div>
			<span className='credit'>powered by TMDB</span>
		</Dialog>
	);
};

export default DialogAddMovie;
