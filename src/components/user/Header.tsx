"use client";

import { FC, useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import {
	FaChevronLeft,
	FaExternalLinkAlt,
	FaGithub,
	FaInstagram,
	FaTiktok,
	FaTimes,
	FaTwitter,
	FaYoutube,
} from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";

import { useSupabase } from "components/auxil/SupabaseProvider";
import Twemoji from "components/icons/Twemoji";
import Toasty from "components/ui/Toasty";

import type { DatabaseEntry } from "types/auxil";

import styles from "styles/modules/UserHeader.module.scss";

const HeaderLoading: FC<{}> = () => {
	return (
		<header className={styles.container}>
			<button type='button' title='open profile tab' className={styles.trigger}>
				<FaChevronLeft />
				<Twemoji emoji='⏳' />
			</button>
		</header>
	);
};

const Header: FC<{}> = () => {
	const { supabase } = useSupabase();
	const params = useParams();

	const [profile, setProfile] = useState<DatabaseEntry<"Profiles">>();
	const [linkCopied, setLinkCopied] = useState<boolean>(false);
	const [location, setLocation] = useState<string>("");
	const [openTab, setOpenTab] = useState<boolean>(false);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(location);
		setLinkCopied(true);
	};

	const showLinks = (): JSX.Element[] => {
		const elements: JSX.Element[] = [];
		const links = profile ? profile.links || [] : [];

		for (let i = 0; i < links.length; i++) {
			elements.push(
				<Link key={i} href={links[i]}>
					{getIcon(links[i])}
				</Link>
			);
		}

		return elements;
	};

	const getIcon = (url: string) => {
		if (url.includes("twitter")) {
			return <FaTwitter />;
		} else if (url.includes("instagram")) {
			return <FaInstagram />;
		} else if (url.includes("tiktok")) {
			return <FaTiktok />;
		} else if (url.includes("youtube")) {
			return <FaYoutube />;
		} else if (url.includes("github")) {
			return <FaGithub />;
		} else {
			return <FaExternalLinkAlt />;
		}
	};

	useEffect(() => {
		(async () => {
			const { data, error } = await supabase
				.from("Profiles")
				.select()
				.eq("username", params.user)
				.single();

			if (error) {
				console.error("There was an error fetching user: '%s'", error.message);
				notFound();
			} else if (data === null) {
				console.warn(`User '${params.user}' could not be found.`);
				notFound();
			}

			setProfile(data);
		})();
	}, [supabase, params.user]);

	useEffect(() => {
		setLocation(window.location.href);
	}, []);

	if (!profile) return <HeaderLoading />;

	return (
		<>
			<Toasty
				message='Link copied to clipboard'
				mode={linkCopied ? "short" : "hidden"}
				onClose={() => setLinkCopied(false)}
			/>

			{/* UI Listeners ^^ */}

			<header className={styles.container}>
				{!openTab && (
					<button
						type='button'
						title='open profile tab'
						className={styles.trigger}
						onClick={() => setOpenTab(!openTab)}>
						<FaChevronLeft />
						<Twemoji emoji={profile.avatar} />
					</button>
				)}
			</header>

			<aside className={`${styles.container} ${openTab ? styles.open : ""}`}>
				<button
					type='reset'
					className={styles.close}
					title='close'
					onClick={() => setOpenTab(false)}>
					<FaTimes />
				</button>
				<div className={styles.info}>
					<Twemoji emoji={profile.avatar || "🙂"} />
					<h2>{profile.username}</h2>
					<span>{profile.flavour}</span>
				</div>
				<hr className={styles.break} />
				<div className={styles.share}>
					<div className={styles.socials}>{showLinks()}</div>
					<div
						title='qrcode for this page, click to copy to clipboard'
						className={styles.qrcode}
						onClick={copyToClipboard}>
						<QRCodeSVG
							value={location}
							width={250}
							height={250}
							className={styles.qrcode}
						/>
					</div>
					<span className='credit'>powered by qrcode.react</span>
				</div>
			</aside>
		</>
	);
};

export default Header;
