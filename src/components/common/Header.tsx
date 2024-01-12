"use client";

import { FC, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { FaHome, FaRegUserCircle, FaUserEdit, FaUserSlash } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";

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
	const pathname = usePathname();

	const [showForm, setShowForm] = useState<boolean>(false);
	const [username, setUsername] = useState<string>();
	const [toggleButtonBar, setToggleButtonBar] = useState<boolean>(false);
	const [currentPath, setCurrentPath] = useState<string>(pathname);

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

	useEffect(() => {
		if (currentPath !== pathname) {
			setToggleButtonBar(false);
			setCurrentPath(pathname);
		}
	}, [pathname, currentPath]);

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

			<header className={`${styles.container} ${toggleButtonBar ? styles.toggled : ""}`}>
				<button
					className={styles.logo}
					type='button'
					onClick={() => setToggleButtonBar(!toggleButtonBar)}
					title='home'>
					<Logo />
				</button>
				<hr />
				<div className={`${styles["button-bar"]} ${toggleButtonBar ? styles.toggled : ""}`}>
					<button type='button' onClick={() => router.push("/")} title='home'>
						<FaHome />
					</button>
					{session ? (
						<>
							<Link title='your rankings' href={`/${username}`} className='button'>
								<FaRankingStar />
							</Link>
							<Link title='your dashboard' href={`/dashboard`} className='button'>
								<FaUserEdit />
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
						<>
							<button type='button' onClick={() => setShowForm(true)} title='sign up'>
								<FaRegUserCircle />
							</button>
						</>
					)}
				</div>
			</header>
		</>
	);
};

export default Header;
