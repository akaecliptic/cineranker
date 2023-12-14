"use client";

import { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { Session, createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "types/supabase";

type SupabaseContext = {
	supabase: SupabaseClient<Database>;
	session: Session | null;
};

type PropSupabaseProvider = {
	session: Session | null;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

const SupabaseProvider: FC<PropsWithChildren<PropSupabaseProvider>> = ({ children, session }) => {
	const [supabase] = useState(() => createBrowserSupabaseClient());
	const router = useRouter();

	useEffect(() => {
		const { data } = supabase.auth.onAuthStateChange(() => {
			router.refresh();
		});

		return () => {
			data.subscription.unsubscribe();
		};
	}, [router, supabase]);

	return (
		<Context.Provider value={{ supabase, session }}>
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
