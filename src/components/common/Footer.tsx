"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub, FaUserEdit, FaUserTag } from "react-icons/fa";

import { useSupabase } from "components/auxil/SupabaseProvider";
import AE from "components/icons/AE";

import styles from "styles/modules/Footer.module.scss";

const Footer: FC = () => {
	const pathname = usePathname();
	const [showDevLinks, setShowDevLinks] = useState<boolean>(
		pathname !== "/dashboard" && !pathname.includes("/list/")
	);
	const { supabase, session, username } = useSupabase();

	useEffect(() => {
		setShowDevLinks(pathname !== "/dashboard" && !pathname.includes("/list/"));
	}, [pathname]);

	return (
		<footer className={styles.container}>
			<div className={styles.links}>
				{pathname !== "/" && <Link href='/'>cineranker</Link>}
				{pathname === "/" && (
					<Link href='https://github.com/akaecliptic/cineranker'>source code</Link>
				)}
				{session?.user && (
					<button className={styles.function} onClick={() => supabase.auth.signOut()}>
						logout
					</button>
				)}
			</div>

			<div className={styles.links}>
				{username && pathname !== `/${username}` && (
					<Link href={`/${username}`} title='profile'>
						<FaUserTag />
					</Link>
				)}
				{session?.user.id && pathname !== "/dashboard" && (
					<Link href='/dashboard' title='dashboard'>
						<FaUserEdit />
					</Link>
				)}
				{showDevLinks && (
					<>
						<Link href='https://github.com/akaecliptic' title='dev-github'>
							<FaGithub />
						</Link>
						<Link href='https://akaecliptic.dev' title='dev-website'>
							<AE />
						</Link>
					</>
				)}
			</div>
		</footer>
	);
};

export default Footer;
