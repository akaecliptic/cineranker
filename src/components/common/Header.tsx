"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { FaRegChartBar, FaRegUserCircle, FaUserCircle, FaUserSlash } from "react-icons/fa";

import { useSupabase } from "components/auxil/SupabaseProvider";
import Dialog from "components/ui/Dialog";
import Logo from "components/icons/Logo";

import vars from "styles/vars.module.scss";
import styles from "styles/modules/Header.module.scss";

const VarsCineranker = {
	default: {
		colors: {
			brand: vars.colorPrimary,
			brandAccent: vars.colorSecondary,
		},
	},
};

const Header: FC = () => {
	const [showForm, setShowForm] = useState<boolean>(false);
	const { supabase, session, username } = useSupabase();
	const router = useRouter();

	useEffect(() => {
		const { data } = supabase.auth.onAuthStateChange(() => {
			setShowForm(false);
		});

		return () => {
			data.subscription.unsubscribe();
		};
	}, [supabase]);

	return (
		<>
			<Dialog show={showForm} onClose={() => setShowForm(false)}>
				<span className='heading'>Get Started</span>
				<Auth
					supabaseClient={supabase}
					socialLayout='vertical'
					view='sign_up'
					appearance={{
						theme: ThemeSupa,
						variables: VarsCineranker,
					}}
					theme='dark'
					providers={["discord"]}
				/>
				<span className='credit'>powered by supabase</span>
			</Dialog>

			<header className={styles.container}>
				<button
					className={styles.logo}
					type='button'
					onClick={() => router.push("/")}
					title='home'>
					<Logo />
				</button>
				<hr />
				<div className={styles["button-bar"]}>
					{session ? (
						<>
							<button
								type='button'
								onClick={() => router.push(`/${username}`)}
								title='your list'>
								<FaRegChartBar />
							</button>
							<button
								type='button'
								onClick={() => router.push(`/dashboard`)}
								title='profile'>
								<FaUserCircle />
							</button>
							<hr className={styles.bottom} />
							<button
								type='button'
								onClick={() => supabase.auth.signOut()}
								title='sign out'>
								<FaUserSlash />
							</button>
						</>
					) : (
						<button type='button' onClick={() => setShowForm(true)} title='sign up'>
							<FaRegUserCircle />
						</button>
					)}
				</div>
			</header>
		</>
	);
};

export default Header;
