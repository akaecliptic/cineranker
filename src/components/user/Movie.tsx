import { FC } from "react";
import Image from "next/image";

import Twemoji from "components/icons/Twemoji";

import type { DatabaseEntry } from "types/auxil";

import styles from "styles/modules/Movie.module.scss";

export type PropMovie = {
	place: number;
	movie: DatabaseEntry<"Movies">;
};

const Movie: FC<PropMovie> = ({ place, movie }) => {
	const getRank = (): string | JSX.Element => {
		const emojiSize = 25;
		switch (place) {
			case 1:
				return <Twemoji emoji='🥇' size={emojiSize} />;
			case 2:
				return <Twemoji emoji='🥈' size={emojiSize - 2.5} />;
			case 3:
				return <Twemoji emoji='🥉' size={emojiSize - 5} />;
			default:
				return place.toString();
		}
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.rank}>{getRank()}</h2>
			<Image
				className={styles.poster}
				src={`https://www.themoviedb.org/t/p/original/${movie.poster}`}
				alt={`${movie.title} poster`}
				width={250}
				height={350}
			/>
			<div className={styles.data}>
				<h4>{movie.year}</h4>
				<h2>{movie.title}</h2>
			</div>
		</div>
	);
};

export default Movie;
