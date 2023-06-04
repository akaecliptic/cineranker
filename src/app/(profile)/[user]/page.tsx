import { notFound } from "next/navigation";
import { headers, cookies } from "next/headers";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";

import Card from "components/user/Card";
import Header from "components/user/Header";

import type { DynamicSegment } from "types/react";
import type { Database } from "types/supabase";

/* @ts-expect-error Async Server Component */
const UserPage: DynamicSegment<{ user: string }> = async ({ params: { user } }) => {
	const supabase = createServerComponentSupabaseClient<Database>({ headers, cookies });

	const initProfile = async () => {
		const { data, error } = await supabase
			.from("Profiles")
			.select()
			.eq("username", user)
			.single();

		if (error || data === null) {
			notFound();
		}

		return data;
	};

	const profile = await initProfile();

	const initListData = async () => {
		const { data, error } = await supabase
			.from("list_data")
			.select()
			.eq("user_id", profile.user_id)
			.order("rank");

		if (error) {
			console.error("Error querying user lises, with code:", error.code);
			return [];
		}

		return data;
	};

	const listData = initListData();

	const [data] = await Promise.all([listData]);

	return (
		<>
			<Header profile={profile} />
			<main>
				<Card data={data} />
			</main>
		</>
	);
};

export default UserPage;
