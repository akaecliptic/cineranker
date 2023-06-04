import { FC } from "react";
import Link from "next/link";
import Image from "next/image";

import imdb from "images/imdb.svg";
import tmdb from "images/tmdb_square.svg";

import Twemoji from "components/icons/Twemoji";

import type { DatabaseEntry } from "types/auxil";

import styles from "styles/modules/Movie.module.scss";

export type PropMovie = {
	place: number;
	movie: DatabaseEntry<"Movies">;
};

const Movie: FC<PropMovie> = ({ place, movie }) => {
	const getRank = (): string | JSX.Element => {
		const emojiSize = 35;
		switch (place) {
			case 1:
				return <Twemoji emoji='🥇' size={emojiSize} />;
			case 2:
				return <Twemoji emoji='🥈' size={emojiSize - 5} />;
			case 3:
				return <Twemoji emoji='🥉' size={emojiSize - 10} />;
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
				width={70}
				height={105}
			/>
			<div className={styles.data}>
				<h4>{movie.year}</h4>
				<h2>{movie.title}</h2>
			</div>
			<div className={styles.logos}>
				<Link href={`https://www.themoviedb.org/movie/${movie.imdb_id}`}>
					<Image
						className={styles.logo}
						src={tmdb}
						alt='TMDB logo'
						width={50}
						height={50}
					/>
				</Link>
				<Link href={`https://www.imdb.com/title/${movie.imdb_id}`}>
					<Image
						className={styles.logo}
						src={imdb}
						alt='IMDB logo'
						width={50}
						height={50}
					/>
				</Link>
			</div>
		</div>
	);
};

export default Movie;
