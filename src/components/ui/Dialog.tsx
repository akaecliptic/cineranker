"use client";

import { FC, PropsWithChildren } from "react";

export type PropDialog = {
	show: boolean;
	onClose: () => void;
};

const Dialog: FC<PropsWithChildren<PropDialog>> = ({ children, show, onClose }) => {
	if (show) {
		return (
			<>
				<div className='ui-dialog'>{children}</div>
				<div className='ui-dialog-overlay' onClick={() => onClose()}></div>
			</>
		);
	} else {
		return <></>;
	}
};

export default Dialog;
