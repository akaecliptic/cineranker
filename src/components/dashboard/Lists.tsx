"use client";

import { FC } from "react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

import type { DatabaseEntry } from "types/auxil";

export const ListsFallback: FC = () => {
	return (
		<section className='collecions-list'>
			<div className='collection-message'>Loading lists...</div>
		</section>
	);
};

type PropItem = {
	list: DatabaseEntry<"Lists">;
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
};

const Item: FC<PropItem> = ({ list, onEdit, onDelete }) => {
	return (
		<div className='collection-item'>
			<h3>{list.title}</h3>
			<div>
				<button type='button' title='edit list' onClick={() => onEdit(list._id)}>
					<FaPencilAlt />
				</button>
				<button
					type='button'
					title='Currently lists can not be deleted'
					onClick={() => onDelete(list._id)}
					disabled>
					<FaTrashAlt />
				</button>
			</div>
		</div>
	);
};

export type PropLists = {
	lists: DatabaseEntry<"Lists">[];
};

const Lists: FC<PropLists> = ({ lists }) => {
	const router = useRouter();

	const onEditList = (id: number) => {
		router.push(`/list/${id}`);
	};

	const onDeleteList = (id: number) => {
		/*
			This behaviour is not difficult to implement,
			just holding off at the moment.
		*/
		// TODO: Implement deleting lists
		console.log("Currently lists can not be deleted.");
	};

	return (
		<section className='collecions-list'>
			{lists.map((item) => (
				<Item key={item._id} list={item} onEdit={onEditList} onDelete={onDeleteList} />
			))}
			{lists.length === 0 && <div className='collection-message'>You have no lists</div>}
		</section>
	);
};

export default Lists;
