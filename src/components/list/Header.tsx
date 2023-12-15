"use client";

import { FC, useEffect, useState } from "react";
import { useEditor } from "components/auxil/ListEditorProvider";
import { useSupabase } from "components/auxil/SupabaseProvider";

const HeaderLoading: FC = () => {
	return (
		<header className='editor'>
			<input type='text' title='loading...' disabled placeholder='loading...' />
		</header>
	);
};

const Header: FC = () => {
	const { working, updateTitle } = useEditor();
	const { supabase, session } = useSupabase();
	const [title, setTitle] = useState<string>();

	useEffect(() => {
		if (!session) return;

		supabase
			.from("Lists")
			.select("title")
			.eq("user_id", session.user.id)
			.eq("_id", working)
			.limit(1)
			.single()
			.then((response) => {
				if (response.error) {
					console.error(
						"There was an error querying list title: '%s'",
						response.error.message
					);

					setTitle("");
					return;
				} else if (!response || !response.data) {
					console.warn("No confidence result. Unexpected empty data response");
					setTitle("");
					return;
				}

				setTitle(response.data.title);
			});
	}, [supabase, session, working]);

	useEffect(() => {
		if (title !== undefined) updateTitle(title);
	}, [title, updateTitle]);

	if (title === undefined) return <HeaderLoading />;

	return (
		<header className='editor'>
			<input
				type='text'
				title='title'
				defaultValue={title}
				onChange={(event) => setTitle(event.currentTarget.value)}
			/>
		</header>
	);
};

export default Header;
