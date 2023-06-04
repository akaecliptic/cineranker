"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { MovieResult } from "moviedb-promise";

import Toasty from "components/ui/Toasty";
import Dialog from "components/ui/Dialog";
import { useEditor } from "components/auxil/ListEditorProvider";
import { ToastyPayload } from "types/auxil";

export const ButtonBarFallback: FC = () => {
	return (
		<>
			<div className='button-bar'>
				<Link href='/dashboard'>
					<button type='button' title='user dashboard'>
						dashboard
					</button>
				</Link>
				<button type='button' title='loading...' disabled>
					add movie
				</button>
				<button type='button' title='loading...' disabled>
					delete movies
				</button>
				<button type='button' title='loading...' disabled>
					save
				</button>
			</div>
		</>
	);
};

export type PropSearchItem = {
	movie: MovieResult;
	onClick: (self: MovieResult) => void;
};

const SearchItem: FC<PropSearchItem> = ({ movie, onClick }) => {
	return (
		<div className='search-item' onClick={() => onClick(movie)}>
			<span>{movie.title}</span>
			<span>({movie.release_date ? movie.release_date.split("-")[0] : "0000"})</span>
		</div>
	);
};

const ButtonBar: FC = () => {
	const [query, setQuery] = useState<string>("");
	const [showSearch, setShowSearch] = useState<boolean>(false);
	const [searchItems, setSearchItems] = useState<MovieResult[]>([]);
	const [emptySearch, setEmptySearch] = useState<boolean>(false);
	const [payload, setPayload] = useState<ToastyPayload>([null, "info"]);

	const {
		list,
		title,
		saveList,
		deleteQueue,
		listMutators: { addMovie, submitDeleteQueue },
	} = useEditor();

	const submitQuery = async () => {
		if (query.replace(/\s/g, "") === "") return;

		const response = await fetch(`http://localhost:3000/api/tmdb?search=${encodeURI(query)}`);
		const data: MovieResult[] | null = await response.json();

		if (data !== null) {
			setSearchItems(() => [...data]);
		}

		setEmptySearch(data === null || data.length === 0);
	};

	const cleanupSearch = () => {
		setQuery("");
		setSearchItems([]);
		setShowSearch(false);
	};

	const onItemClickHandler = (self: MovieResult) => {
		if (list.length === 5) {
			alert("Current list capacity is 5");
			return;
		}

		const filtered = list.filter((item) => item.tmdb_id === self.id);
		if (filtered.length > 0) return;

		addMovie(self);
	};

	const onSaveHandler = async () => {
		if (title.replace(/\s/g, "") === "") {
			setPayload(["Invalid list title", "alert"]);
			return;
		} else if (list.length === 0) {
			setPayload(["List cannot be empty", "alert"]);
			return;
		}

		const saved = await saveList();

		setPayload(saved ? ["List saved", "info"] : ["List failed to save", "alert"]);
	};

	return (
		<>
			<Toasty
				message={payload[0] || ""}
				mode={payload[0] ? "long" : "hidden"}
				channel={payload[1]}
				onClose={() => setPayload([null, "info"])}
			/>

			<Dialog show={showSearch} onClose={cleanupSearch}>
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

			{/* UI Listeners ^^ */}

			<div className='button-bar'>
				<Link href='/dashboard'>
					<button type='button' title='user dashboard'>
						dashboard
					</button>
				</Link>
				<button
					type='button'
					title={list.length === 5 ? "list is full" : "add movie"}
					disabled={list.length === 5}
					onClick={() => setShowSearch(true)}>
					add movie
				</button>
				<button
					type='button'
					title={deleteQueue.size === 0 ? "select movies to delete" : "delete movies"}
					disabled={deleteQueue.size === 0}
					onClick={submitDeleteQueue}>
					delete movies
				</button>
				<button type='button' title='save' onClick={onSaveHandler}>
					save
				</button>
			</div>
		</>
	);
};

export default ButtonBar;
