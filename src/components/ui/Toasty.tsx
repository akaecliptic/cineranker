import { FC, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";

export type PropToasty = {
	message: string;
	channel?: "alert" | "info";
	mode?: "hidden" | "short" | "long" | "stay";
	onClose: () => void;
};

const Toasty: FC<PropToasty> = ({ message, channel = "info", mode = "hidden", onClose }) => {
	const timer = useRef<NodeJS.Timer>();

	const closeToast = () => {
		if (timer.current) clearInterval(timer.current);
		onClose();
	};

	useEffect(() => {
		if (mode === "hidden" || mode === "stay") return;

		let timeout: number;

		if (mode === "short") {
			timeout = 2500;
		} else {
			timeout = 5000;
		}

		timer.current = setTimeout(() => onClose(), timeout);
	}, [channel, mode, onClose]);

	return (
		<div className={"ui-toasty" + " " + channel + " " + mode}>
			<span>{message}</span>
			<button type='button' title='close-toasty' onClick={() => closeToast()}>
				<FaTimes />
			</button>
		</div>
	);
};

export default Toasty;
