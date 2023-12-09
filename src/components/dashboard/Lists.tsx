"use client";

import { FC, useEffect, useState } from "react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

import type { DatabaseEntry } from "types/auxil";
import CreateList from "components/dashboard/CreateList";
import { useSupabase } from "components/auxil/SupabaseProvider";

const ListsFallback: FC = () => {
	return (
		<section className='collecions-list'>
			<div className='collection-message'>Loading lists...</div>
		</section>
	);
};

type ListItem = {
	entry: DatabaseEntry<"Lists">;
	entryCount: number;
};

type PropItem = {
	list: ListItem;
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
};

const Item: FC<PropItem> = ({ list, onEdit, onDelete }) => {
	return (
		<div className='collection-item'>
			<div className='collection-item-info'>
				<h3>{list.entry.title}</h3>
				<h4>entries: {list.entryCount}</h4>
				<h4>created: {list.entry.created_at.split("T")[0]}</h4>
			</div>
			<div className='collection-item-buttons'>
				<button type='button' title='edit list' onClick={() => onEdit(list.entry._id)}>
					<FaPencilAlt />
				</button>
				<button type='button' title='delete list' onClick={() => onDelete(list.entry._id)}>
					<FaTrashAlt />
				</button>
			</div>
		</div>
	);
};

const Lists: FC<{}> = () => {
	const router = useRouter();
	const { supabase, session } = useSupabase();
	const [count, setCount] = useState<number>();
	const [lists, setLists] = useState<ListItem[]>();

	const onEditList = (id: number) => {
		router.push(`/list/${id}`);
	};

	const onDeleteList = async (id: number) => {
		const { error } = await supabase.from("Lists").delete().eq("_id", id);

		if (error) {
			console.error("There was an error deleting list: '%s'", error.message);
			return;
		}

		setLists((old) => old?.filter((item) => item.entry._id !== id));
	};

	useEffect(() => {
		if (!session) return;

		(async () => {
			const { data, error } = await supabase
				.from("Lists")
				.select("*, Movies(count)")
				.eq("user_id", session.user.id);

			if (error) {
				console.error("There was an error fetching lists: '%s'", error.message);
				setLists([]);
				setCount(0);
				return;
			}

			const formatedData: ListItem[] = data.map((item) => {
				const entryCount = Array.isArray(item.Movies)
					? (item.Movies[0].count as number)
					: item.Movies && "count" in item.Movies
					? (item.Movies.count as number)
					: 0;

				return { entry: item, entryCount };
			});

			setLists(formatedData);
			setCount(data.length);
		})();
	}, [supabase, session]);

	if (lists === undefined || count === undefined) return <ListsFallback />;

	return (
		<>
			<section className='collecions-list'>
				{lists.map((item) => (
					<Item
						key={item.entry._id}
						list={item}
						onEdit={onEditList}
						onDelete={onDeleteList}
					/>
				))}
				{lists.length === 0 && <div className='collection-message'>You have no lists</div>}
			</section>
			<CreateList count={count} />
		</>
	);
};

export default Lists;
