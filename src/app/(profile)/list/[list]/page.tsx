import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";

import ListEditorProvider from "components/auxil/ListEditorProvider";
import ButtonBar from "components/list/ButtonBar";
import Container from "components/list/Container";
import Header from "components/list/Header";

import type { DynamicSegment } from "types/react";
import type { DatabaseEntry } from "types/auxil";
import type { Database } from "types/supabase";

import "styles/pages/list.scss";

export const revalidate = 0;

/* @ts-expect-error Async Server Component */
const ListPage: DynamicSegment<{ list }> = async ({ params: { list: working } }) => {
	const supabase = createServerComponentSupabaseClient<Database>({ headers, cookies });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	const initList = async (): Promise<[string, DatabaseEntry<"Movies">[]]> => {
		if (session === null) {
			redirect("/");
		}

		const { data, error } = await supabase
			.from("list_data")
			.select("list, title, tmdb_id, imdb_id, rank, year, poster")
			.eq("user_id", session.user.id)
			.eq("_id", working)
			.order("rank", { ascending: true });

		if (error) {
			console.error("Error querying user lists, with code:", error.code);
			return ["", []];
		}

		const list = data[0]?.list || "";

		return [list, data as DatabaseEntry<"Movies">[]];
	};

	const listData = initList();

	const [data] = await Promise.all([listData]);

	return (
		<ListEditorProvider working={working} data={data}>
			<Header />
			<main>
				<Container />
				<ButtonBar />
			</main>
		</ListEditorProvider>
	);
};

export default ListPage;
