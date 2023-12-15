import { FC, MouseEventHandler } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import Image from "next/image";

import type { DatabaseEntry } from "types/auxil";

export type PropListItem = {
	movie: DatabaseEntry<"Movies">;
	position: number;
	last?: boolean;
	mover: (self: DatabaseEntry<"Movies">, position: number, direction: 1 | -1) => void;
	select: (self: DatabaseEntry<"Movies">, element: HTMLDivElement) => void;
};

const ListItem: FC<PropListItem> = ({ movie, position, last, mover, select }) => {
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

export default ListItem;
