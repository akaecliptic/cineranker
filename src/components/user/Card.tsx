"use client";

import { FC, useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { useSupabase } from "components/auxil/SupabaseProvider";
import Movie from "components/user/Movie";

import type { DatabaseEntry, DatabaseView } from "types/auxil";

import styles from "styles/modules/Card.module.scss";

type PropDot = {
	active?: boolean;
};

const Dot: FC<PropDot> = ({ active }) => {
	const styleClass: string = active ? styles.dot + " " + styles.active : styles.dot;
	return <div className={styleClass}></div>;
};

const Card: FC<{}> = () => {
	const { supabase } = useSupabase();
	const params = useParams();

	const [lists, setLists] = useState<[string, DatabaseEntry<"Movies">[]][]>([]);
	const [active, setActive] = useState<number>(0);

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

	useEffect(() => {
		(async () => {
			const { data, error } = await supabase
				.from("list_data")
				.select("*, Profiles!inner()")
				.eq("Profiles.username", params.user)
				.order("rank");

			if (error) {
				console.error("There was an error fetching user: '%s'", error.message);
				notFound();
			} else if (data === null) {
				console.warn(`User '${params.user}' could not be found.`);
				notFound();
			} else if (data.length > 0 && !("list" in data[0])) {
				console.warn("No confidence in data quality, returning empty data");
				setLists([]);
				return;
			}

			const santisedData = data as unknown as DatabaseView[];
			const map: Map<string, DatabaseEntry<"Movies">[]> = new Map();

			santisedData.forEach((item) => {
				if (item.list === null) return;

				if (map.has(item.list)) {
					map.get(item.list)?.push(item as DatabaseEntry<"Movies">);
				} else {
					map.set(item.list, [item as DatabaseEntry<"Movies">]);
				}
			});

			setLists(Array.from(map.entries()));
		})();
	}, [supabase, params.user]);

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<button onClick={() => updateActive(true)} type='button' title='scroll-left'>
					<FaChevronLeft />
				</button>
				<div className={styles.heading}>
					<h1 className={styles.title}>{lists.length === 0 ? "" : lists[active][0]}</h1>
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
