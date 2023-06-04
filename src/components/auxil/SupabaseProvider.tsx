"use client";

import { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { Session, createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "types/supabase";

type SupabaseContext = {
	supabase: SupabaseClient<Database>;
	session: Session | null;
	username: string | null;
};

type PropSupabaseProvider = {
	session: Session | null;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

const SupabaseProvider: FC<PropsWithChildren<PropSupabaseProvider>> = ({ children, session }) => {
	const [supabase] = useState(() => createBrowserSupabaseClient());
	const [username, setUsername] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		(async () => {
			if (username !== null) return;

			if (session === null) {
				setUsername(null);
				return;
			}

			const { data, error } = await supabase
				.from("Profiles")
				.select("username")
				.eq("user_id", session.user.id)
				.single();

			if (error) {
				console.error("Error navigating to user profile, with code:", error.code);
				setUsername(null);
				return;
			}

			setUsername(data.username);
		})();
	}, [supabase, session, username]);

	useEffect(() => {
		const { data } = supabase.auth.onAuthStateChange(() => {
			router.refresh();
		});

		return () => {
			data.subscription.unsubscribe();
		};
	}, [router, supabase]);

	return (
		<Context.Provider value={{ supabase, session, username }}>
			<>{children}</>
		</Context.Provider>
	);
};

export const useSupabase = () => {
	const context = useContext(Context);

	if (!context) throw new Error("useSupabase must be used inside SupabaseProvider");

	return context;
};

export default SupabaseProvider;
