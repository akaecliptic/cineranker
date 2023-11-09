import { FC } from "react";

export type PropCard = {
	title: string;
};

const Card: FC<PropCard> = ({ title }) => {
	return (
		<div className='card'>
			<span className='title'>
				<span>{title.length >= 1 && title.charAt(0)}</span>
				<span>{title.substring(1)}</span>
			</span>
			<div className='content'></div>
		</div>
	);
};

export default Card;
