"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";

import { useSupabase } from "components/auxil/SupabaseProvider";
import Toasty from "components/ui/Toasty";

export const CreateListFallback: FC = () => {
	return (
		<button id='create-list' type='button' title='loading...'>
			create
		</button>
	);
};

export type PropCreateList = {
	count: number;
};

const CreateList: FC<PropCreateList> = ({ count }) => {
	const router = useRouter();
	const [message, setMessage] = useState<string | null>(null);
	const { supabase, session } = useSupabase();

	const isCapped = (): boolean => {
		const atCapacity = count >= 3;
		setMessage(atCapacity ? "The current list capacity is 3" : null);
		return atCapacity;
	};

	const onCreate = async () => {
		if (session === null || count >= 3) return;

		const { data, error } = await supabase
			.from("Lists")
			.insert({ user_id: session.user.id, title: "new list" })
			.select();

		if (error) {
			console.error("Error creating new list, with code:", error.code);
			setMessage("Creating list failed");
			return;
		}

		router.push(`/editor/list/${data[0]._id}`);
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
				create
			</button>
		</>
	);
};

export default CreateList;
