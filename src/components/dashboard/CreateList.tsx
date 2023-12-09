"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";

import { useSupabase } from "components/auxil/SupabaseProvider";
import Toasty from "components/ui/Toasty";

export type PropCreateList = {
	count: number;
};

const CreateList: FC<PropCreateList> = ({ count }) => {
	const router = useRouter();
	const { supabase, session } = useSupabase();
	const [message, setMessage] = useState<string | null>(null);

	const LIST_CAP = 5;

	const isCapped = (): boolean => {
		const atCapacity = count === undefined || count >= LIST_CAP;
		setMessage(atCapacity ? `The current list capacity is ${LIST_CAP}` : null);
		return atCapacity;
	};

	const onCreate = async () => {
		if (session === null || (count !== undefined && count >= LIST_CAP)) return;

		const { data, error } = await supabase
			.from("Lists")
			.insert({ user_id: session.user.id, title: "new list" })
			.select()
			.limit(1)
			.single();

		if (error) {
			console.error("Error creating new list, with code:", error.code);
			setMessage("Creating list failed");
			return;
		}

		router.push(`/list/${data._id}`);
	};

	return (
		<>
			<Toasty
				message={message || ""}
				mode={message ? "long" : "hidden"}
				onClose={() => setMessage(null)}
			/>

			<button
				id='create-list'
				type='button'
				title='create new list'
				onClick={() => !isCapped() && onCreate()}>
				<FaPlus />
			</button>
		</>
	);
};

export default CreateList;
