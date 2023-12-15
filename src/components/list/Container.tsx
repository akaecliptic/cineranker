"use client";

import { DragEventHandler, FC, useEffect, useState } from "react";

import type { DatabaseEntry } from "types/auxil";

import { useListMutator } from "hooks/useListMutator";
import { useEditor } from "components/auxil/ListEditorProvider";
import { useSupabase } from "components/auxil/SupabaseProvider";

import DialogAddMovie from "components/list/DialogAddMovie";
import ButtonBar from "components/list/ButtonBar";
import ListItem from "components/list/ListItem";

const ContainerLoading: FC = () => {
	return (
		<section className='container-items'>
			<span className='container-items-message'>Loading...</span>
		</section>
	);
};

const Container: FC = () => {
	const { working, updateList } = useEditor();

	const { supabase, session } = useSupabase();
	const [list, setList] = useState<DatabaseEntry<"Movies">[]>();

	const { addMovie, toggleDelete, submitDeleteQueue } = useListMutator(setList);

	const dropHandler: DragEventHandler<HTMLElement> = (event) => {
		const target = event.target as HTMLElement;

		if (!target.classList.contains("floater") || !list) return;

		target.classList.remove("hover");

		const parent = target.parentElement!;
		const rawNewPos = parent.getAttribute("data-position");

		if (rawNewPos === null) return;

		const newPos = parseInt(rawNewPos);
		const raw = event.dataTransfer.getData("movie");
		const movie = JSON.parse(raw);
		const isTop = target.classList.contains("top");

		let pos = -1;
		list.forEach((item, index) => {
			if (movie.tmdb_id === item.tmdb_id) pos = index;
		});

		if ((isTop && pos + 1 === newPos) || (!isTop && pos - 1 === newPos)) return;

		list.splice(pos, 1);
		list.splice(newPos, 0, movie);

		setList([...list]);
	};

	const onMoveHandler = (self: DatabaseEntry<"Movies">, position: number, direction: 1 | -1) => {
		if (!list) return;

		const newPosition = position - direction;

		list.splice(position, 1);
		list.splice(newPosition, 0, self);

		setList([...list]);
	};

	const onSelectHandler = (self: DatabaseEntry<"Movies">, element: HTMLDivElement) => {
		toggleDelete(self.tmdb_id);
		element.classList.toggle("selected");
	};

	useEffect(() => {
		if (!session) return;

		supabase
			.from("Movies")
			.select("*, Lists!inner(_id)")
			.eq("Lists._id", working)
			.then((response) => {
				if (response.error) {
					console.error("There was an error querying list: '%s'", response.error.message);
					setList([]);
					return;
				} else if (!response || !response.data) {
					setList([]);
					return;
				}

				const sanitisedData = response.data.map((item) => {
					// https://stackoverflow.com/questions/43011742/
					// ^ This is cool, unless it's frowned upon and bad practice, then it's not... ^
					const { Lists: _, ...filtered } = item;
					return filtered;
				});

				setList(sanitisedData);
			});
	}, [supabase, session, working]);

	useEffect(() => {
		if (list !== undefined) updateList(list);
	}, [list, updateList]);

	if (list === undefined) return <ContainerLoading />;

	return (
		<>
			<DialogAddMovie list={list} addMovie={addMovie} />

			{/* UI Listeners ^^ */}

			<section
				className='container-items'
				onDrop={dropHandler}
				onDragOver={(event) => event.preventDefault()}>
				{list.length === 0 ? (
					<span className='container-items-message'>It is empty here</span>
				) : (
					list.map((item, index) => (
						<ListItem
							key={item.tmdb_id}
							movie={item}
							position={index}
							last={list.length - 1 === index}
							mover={onMoveHandler}
							select={onSelectHandler}
						/>
					))
				)}
			</section>

			<ButtonBar submitDeleteQueue={submitDeleteQueue} />
		</>
	);
};

export default Container;
