"use client";

import { useEditor } from "components/auxil/ListEditorProvider";
import { FC } from "react";

export const HeaderFallback: FC = () => {
	return (
		<header>
			<input type='text' title='loading...' disabled />
		</header>
	);
};

const Header: FC = () => {
	const { title, setTitle } = useEditor();

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
