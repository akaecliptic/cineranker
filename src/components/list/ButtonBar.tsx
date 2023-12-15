"use client";

import { FC, useState } from "react";

import { ToastyPayload } from "types/auxil";

import { useEditor } from "components/auxil/ListEditorProvider";
import Toasty from "components/ui/Toasty";

export type PropButtonBar = {
	submitDeleteQueue: () => Set<number>;
};

const ButtonBar: FC<PropButtonBar> = ({ submitDeleteQueue }) => {
	const [payload, setPayload] = useState<ToastyPayload>([null, "info"]);
	const { submitSaveList, updateDeleted, dialogController } = useEditor();

	const onSaveHandle = async () => {
		const payload = await submitSaveList();
		setPayload(payload);
	};

	const onDeleteHandle = () => {
		const deleted = submitDeleteQueue();
		updateDeleted(deleted);
	};

	return (
		<>
			<Toasty
				message={payload[0] || ""}
				mode={payload[0] ? "long" : "hidden"}
				channel={payload[1]}
				onClose={() => setPayload([null, "info"])}
			/>

			{/* UI Listeners ^^ */}

			<div className='button-bar'>
				<button
					type='button'
					title={"add movie"}
					onClick={() => dialogController.setShowDialog(true)}>
					add movie
				</button>
				<button type='button' title={"delete movies"} onClick={onDeleteHandle}>
					delete movies
				</button>
				<button type='button' title='save' onClick={onSaveHandle}>
					save
				</button>
			</div>
		</>
	);
};

export default ButtonBar;
