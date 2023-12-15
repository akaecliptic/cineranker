import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";

import ListEditorProvider from "components/auxil/ListEditorProvider";
import Container from "components/list/Container";
import Header from "components/list/Header";

import type { DynamicSegment } from "types/react";
import type { Database } from "types/supabase";

import "styles/pages/list.scss";

export const revalidate = 0;

/* @ts-expect-error Async Server Component */
const ListPage: DynamicSegment<{ list }> = async ({ params: { list: working } }) => {
	const supabase = createServerComponentSupabaseClient<Database>({ headers, cookies });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) redirect("/");

	return (
		<ListEditorProvider working={working}>
			<main>
				<Header />
				<Container />
			</main>
		</ListEditorProvider>
	);
};

export default ListPage;
