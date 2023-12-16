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
import Link from "next/link";

const VarsCineranker = {
	default: {
		colors: {
			brand: vars.colorPrimary,
			brandAccent: vars.colorSecondary,
		},
	},
};

const Header: FC = () => {
	const { supabase, session } = useSupabase();
	const router = useRouter();
	const [showForm, setShowForm] = useState<boolean>(false);
	const [username, setUsername] = useState<string>();

	useEffect(() => {
		if (!session) {
			setUsername("");
			return;
		}

		supabase
			.from("Profiles")
			.select("username")
			.eq("user_id", session.user.id)
			.single()
			.then((response) => {
				if (response.error) {
					console.error("Error querying username, with code:", response.error.code);
					setUsername("");
					return;
				} else if (!response.data) {
					console.warn("No confidence result, querying username for current session");
					setUsername("");
					return;
				}

				setUsername(response.data.username);
			});
	}, [supabase, session]);

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
							<Link title='your rankings' href={`/${username}`} className='button'>
								<FaRegChartBar />
							</Link>
							<Link title='your dashboard' href={`/dashboard`} className='button'>
								<FaUserCircle />
							</Link>
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
