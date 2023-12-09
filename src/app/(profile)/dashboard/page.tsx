import { FC } from "react";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";

import Lists from "components/dashboard/Lists";
import Header from "components/dashboard/Header";

import type { DatabaseEntry } from "types/auxil";
import type { Database } from "types/supabase";

import "styles/pages/dashboard.scss";

export const revalidate = 0;

/* @ts-expect-error Async Server Component */
const DashboardPage: FC = async () => {
	const supabase = createServerComponentSupabaseClient<Database>({ headers, cookies });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	const initList = async (): Promise<DatabaseEntry<"Lists">[]> => {
		if (session === null) {
			redirect("/");
		}

		const { data, error } = await supabase
			.from("Lists")
			.select()
			.eq("user_id", session.user.id);

		if (error) {
			console.error("Error querying user lists, with code:", error);
			return [];
		}

		return data;
	};

	const initCount = async () => {
		if (session === null) return 0;

		const response = await supabase
			.from("Lists")
			.select("*", { count: "exact" })
			.eq("user_id", session.user.id);

		return response.count || 0;
	};

	const initProfile = async (): Promise<DatabaseEntry<"Profiles"> | null> => {
		if (session === null) return null;

		const { data, error } = await supabase
			.from("Profiles")
			.select("*")
			.eq("user_id", session.user.id)
			.single();

		if (error) {
			console.error("Error querying user profile, with code:", error.code);
			return null;
		}

		return data;
	};

	const listData = initList();
	const countData = initCount();
	const profileData = initProfile();

	const [lists, count, profile] = await Promise.all([listData, countData, profileData]);

	return (
		<>
			<main>
				<Header initial={profile} count={count} />
				<Lists lists={lists} />
			</main>
		</>
	);
};

export default DashboardPage;
