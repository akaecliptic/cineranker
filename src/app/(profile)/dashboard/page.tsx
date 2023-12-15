import { FC } from "react";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";

import Lists from "components/dashboard/Lists";
import Header from "components/dashboard/Header";

import type { Database } from "types/supabase";

import "styles/pages/dashboard.scss";

/* @ts-expect-error Async Server Component */
const DashboardPage: FC = async () => {
	const supabase = createServerComponentSupabaseClient<Database>({ headers, cookies });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) redirect("/");

	return (
		<main>
			<Header />
			<Lists />
		</main>
	);
};

export default DashboardPage;
