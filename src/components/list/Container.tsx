"use client";

import { DragEventHandler, FC, MouseEventHandler } from "react";
import Image from "next/image";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

import { useEditor } from "components/auxil/ListEditorProvider";

import type { DatabaseEntry } from "types/auxil";

export const ContainerFallback: FC = () => {
	return (
		<section className='container-items'>
			<span className='container-items-message'>Loading...</span>
		</section>
	);
};

export type PropItem = {
	movie: DatabaseEntry<"Movies">;
	position: number;
	last?: boolean;
	mover: (self: DatabaseEntry<"Movies">, position: number, direction: 1 | -1) => void;
	select: (self: DatabaseEntry<"Movies">, element: HTMLDivElement) => void;
};

const Item: FC<PropItem> = ({ movie, position, last, mover, select }) => {
	const sanitiseClick: MouseEventHandler<HTMLDivElement> = (event) => {
		if (event.target instanceof HTMLButtonElement) return;
		select(movie, event.currentTarget as HTMLDivElement);
	};

	return (
		<div
			data-position={position}
			className='list-item'
			draggable
			onClick={sanitiseClick}
			onDragStart={(event) => event.dataTransfer.setData("movie", JSON.stringify(movie))}>
			<div
				className='floater top'
				onDragEnter={(event) => event.currentTarget.classList.add("hover")}
				onDragLeave={(event) => event.currentTarget.classList.remove("hover")}>
				{position != 0 && (
					<button
						type='button'
						title='movie item up'
						onClick={() => mover(movie, position, 1)}>
						<FaCaretUp />
					</button>
				)}
			</div>
			<div
				className='floater bottom'
				onDragEnter={(event) => event.currentTarget.classList.add("hover")}
				onDragLeave={(event) => event.currentTarget.classList.remove("hover")}>
				{!last && (
					<button
						type='button'
						title='movie item down'
						onClick={() => mover(movie, position, -1)}>
						<FaCaretDown />
					</button>
				)}
			</div>
			<div className='content'>
				<h2>{position + 1}</h2>
				<Image
					src={`https://www.themoviedb.org/t/p/original/${movie.poster}`}
					alt={`${movie.title} poster`}
					width={70}
					height={105}
				/>
				<div>
					<span>({movie.year})</span>
					<h2>{movie.title}</h2>
				</div>
			</div>
		</div>
	);
};

const Container: FC = () => {
	const {
		list,
		listMutators: { setList, toggleDelete },
	} = useEditor();

	const dropHandler: DragEventHandler<HTMLElement> = (event) => {
		const target = event.target as HTMLElement;

		if (!target.classList.contains("floater")) return;

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
		const newPosition = position - direction;

		list.splice(position, 1);
		list.splice(newPosition, 0, self);

		setList([...list]);
	};

	const onSelectHandler = (self: DatabaseEntry<"Movies">, element: HTMLDivElement) => {
		toggleDelete(self.tmdb_id);
		element.classList.toggle("selected");
	};

	return (
		<section
			className='container-items'
			onDrop={dropHandler}
			onDragOver={(event) => event.preventDefault()}>
			{list.length === 0 ? (
				<span className='container-items-message'>It is empty here</span>
			) : (
				list.map((item, index) => (
					<Item
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
	);
};

export default Container;
