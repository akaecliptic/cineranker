"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import { useSupabase } from "components/auxil/SupabaseProvider";
import Dialog from "components/ui/Dialog";

import vars from "styles/vars.module.scss";

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

			<header>
				<h1 className='title'>
					<span>CINE</span>
					<span>RANKER</span>
				</h1>
				<div className='button-bar'>
					{session ? (
						<>
							<Link href={`/${username}`}>
								<button type='button' title='user'>
									profile
								</button>
							</Link>
							<Link href='/dashboard' title='user dashboard'>
								<button type='button'>dashboard</button>
							</Link>
						</>
					) : (
						<button type='button' onClick={() => setShowForm(true)} title='sign up'>
							sign up
						</button>
					)}
				</div>
			</header>
		</>
	);
};

export default Header;
