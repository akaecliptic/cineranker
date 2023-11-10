"use client";

import { FC, useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import styles from "styles/modules/Card.module.scss";
import Movie from "components/user/Movie";

import type { DatabaseEntry, DatabaseView } from "types/auxil";

export type PropDot = {
	active?: boolean;
};

const Dot: FC<PropDot> = ({ active }) => {
	const styleClass: string = active ? styles.dot + " " + styles.active : styles.dot;
	return <div className={styleClass}></div>;
};

export type PropCard = {
	data: DatabaseView[];
};

const Card: FC<PropCard> = ({ data }) => {
	const [active, setActive] = useState<number>(0);

	const lists = useMemo<[string, DatabaseEntry<"Movies">[]][]>(() => {
		const map: Map<string, DatabaseEntry<"Movies">[]> = new Map();

		data.forEach((item) => {
			if (item.list === null) return;

			if (map.has(item.list)) {
				map.get(item.list)?.push(item as DatabaseEntry<"Movies">);
			} else {
				map.set(item.list, [item as DatabaseEntry<"Movies">]);
			}
		});

		return Array.from(map.entries());
	}, [data]);

	const updateActive = (left?: boolean): void => {
		if (lists.length === 0) return;

		const container: HTMLDivElement = document.getElementById(
			"listContainer"
		) as HTMLDivElement;
		const scrollBy = container.scrollWidth / lists.length;

		if (left && active - 1 >= 0) {
			setActive(active - 1);
			container.scrollLeft -= scrollBy;
		} else if (!left && active + 1 < lists.length) {
			setActive(active + 1);
			container.scrollLeft += scrollBy;
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<button onClick={() => updateActive(true)} type='button' title='scroll-left'>
					<FaChevronLeft />
				</button>
				<div className={styles.heading}>
					<h1 className={styles.title}>
						{lists.length === 0 ? "No lists created" : lists[active][0]}
					</h1>
					<div className={styles.dots}>
						{lists.map((list, index) => (
							<Dot key={list[0]} active={index === active} />
						))}
					</div>
				</div>
				<button onClick={() => updateActive()} type='button' title='scroll-right'>
					<FaChevronRight />
				</button>
			</div>
			<div id='listContainer' className={styles.body}>
				{lists.map((list) => (
					<div key={list[0]} className={styles.list}>
						<div className={styles.grid}>
							{list[1].map((movie, index) => (
								<Movie key={movie.tmdb_id} place={index + 1} movie={movie} />
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Card;
