"use client";

import { FC, useEffect, useState } from "react";

import Twemoji from "components/icons/Twemoji";

export type PropEditableSocial = {
	initial?: string;
	onChange: (value: string) => void;
};

const EditableSocial: FC<PropEditableSocial> = ({ initial = "", onChange }) => {
	const [link, setLink] = useState<string>("🔗");
	const [value, setValue] = useState<string>(initial);

	useEffect(() => {
		if (value.includes("twitter")) {
			setLink("🐦");
		} else if (value.includes("instagram")) {
			setLink("📷");
		} else if (value.includes("tiktok")) {
			setLink("🎵");
		} else if (value.includes("youtube")) {
			setLink("📹");
		} else if (value.includes("github")) {
			setLink("💻");
		} else {
			setLink("🔗");
		}
	}, [link, value, initial]);

	useEffect(() => {
		setValue(initial);
	}, [initial]);

	return (
		<div className='editable-social'>
			<Twemoji emoji={link} />
			<input
				type='text'
				name='social'
				title='social'
				placeholder='Link to social profile'
				onChange={(event) => {
					setValue(event.currentTarget.value);
					onChange(event.currentTarget.value);
				}}
				defaultValue={initial}
			/>
		</div>
	);
};

export default EditableSocial;
