"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { EmojiPicker, createPicker } from "picmo";
import { TwemojiRenderer } from "@picmo/renderer-twemoji";

import Twemoji from "components/icons/Twemoji";
import Dialog from "components/ui/Dialog";

export type PropEditableAvatar = {
	initial: string;
	onSelect: (emoji: string) => void;
};

const EditableAvatar: FC<PropEditableAvatar> = ({ initial, onSelect }) => {
	const [avatar, setAvatar] = useState<string>(initial);
	const [showPicker, setShowPicker] = useState<boolean>(false);

	const onEmojiSelect = useCallback(
		(event: { emoji: string }) => {
			setAvatar(event.emoji);
			onSelect(event.emoji);
			setShowPicker(false);
		},
		[setAvatar, onSelect, setShowPicker]
	);

	useEffect(() => {
		if (!showPicker) return;

		const element = document.getElementById("avatarPicker") as HTMLDivElement;
		const picker: EmojiPicker = createPicker({
			rootElement: element,
			showPreview: false,
			showRecents: false,
			showVariants: false,
			theme: "Dark",
			emojisPerRow: 7,
			renderer: new TwemojiRenderer(),
		});

		picker.addEventListener("emoji:select", onEmojiSelect);

		return () => {
			if (picker) picker.removeEventListener("emoji:select", onEmojiSelect);
		};
	}, [onEmojiSelect, showPicker]);

	useEffect(() => {
		setAvatar(initial);
	}, [initial]);

	return (
		<>
			<Dialog show={showPicker} onClose={() => setShowPicker(false)}>
				<div id='avatarPicker' />
				<span className='credit'>powered by picmo</span>
			</Dialog>

			{/* UI Listeners ^^ */}

			<div className='editable-avatar'>
				<div className='avatar' onClick={() => setShowPicker(true)}>
					<Twemoji emoji={avatar} />
				</div>
				<div className='icon'>
					<FaPencilAlt />
				</div>
			</div>
		</>
	);
};

export default EditableAvatar;
