import type { Metadata } from "next";
import { headers, cookies } from "next/headers";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";

import Footer from "components/common/Footer";
import Header from "components/common/Header";
import SupabaseProvider from "components/auxil/SupabaseProvider";

import type { FunctionalLayout } from "types/react";

import "styles/globals.scss";
import "styles/commons/ui.scss";

export const metadata: Metadata = {
	title: "Cineranker",
	keywords: "List, Rank, Share, React, Cinema, Movies, Cinephile",
	description: "List, Rank and Share movies",
};

/* @ts-expect-error Async Server Component */
const RootLayout: FunctionalLayout = async ({ children }) => {
	const supabase = createServerComponentSupabaseClient({ headers, cookies });
	const { data } = await supabase.auth.getSession();

	return (
		<html lang='en'>
			<body>
				<SupabaseProvider session={data.session}>
					<Header />
					<>{children}</>
					<Footer />
				</SupabaseProvider>
			</body>
		</html>
	);
};

export default RootLayout;
