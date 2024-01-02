import Twemoji from "components/icons/Twemoji";
import { FC } from "react";

export type PropCard = {
	title: string;
	content: string;
	emoji: string;
};

const Card: FC<PropCard> = ({ title, content, emoji }) => {
	return (
		<div className='card'>
			<span className='title'>
				<span>{title.length >= 1 && title.charAt(0)}</span>
				<span>{title.substring(1)}</span>
			</span>
			<div className='content'>
				<p>{content}</p>
				<Twemoji emoji={emoji} size={65} />
			</div>
		</div>
	);
};

export default Card;
