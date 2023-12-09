"use client";

import { FC, useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import {
	FaExternalLinkAlt,
	FaGithub,
	FaInstagram,
	FaLink,
	FaQrcode,
	FaSpinner,
	FaTiktok,
	FaTwitter,
	FaYoutube,
} from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";

import { useSupabase } from "components/auxil/SupabaseProvider";
import Twemoji from "components/icons/Twemoji";
import Dialog from "components/ui/Dialog";
import Toasty from "components/ui/Toasty";

import type { DatabaseEntry } from "types/auxil";

import styles from "styles/modules/UserHeader.module.scss";

const HeaderLoading: FC<{}> = () => {
	return (
		<header className={styles.container}>
			<div className={styles.avatar}></div>
			<div className={styles.content}>
				<div className={styles.info}>
					<h2>loading...</h2>
					<span></span>
				</div>
				<div className={styles.links}>
					<div className={styles.socials}>
						<FaSpinner />
					</div>
					<div className={styles.share}>
						<button type='button' title='loading...' disabled>
							<FaLink />
						</button>
						<button type='button' title='loading...' disabled>
							<FaQrcode />
						</button>
					</div>
				</div>
			</div>
		</header>
	);
};

const Header: FC<{}> = () => {
	const { supabase } = useSupabase();
	const params = useParams();

	const [profile, setProfile] = useState<DatabaseEntry<"Profiles">>();
	const [showQr, setShowQr] = useState<boolean>(false);
	const [linkCopied, setLinkCopied] = useState<boolean>(false);
	const [location, setLocation] = useState<string>("");

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
			<Dialog show={showQr} onClose={() => setShowQr(false)}>
				<span className='heading'>{`${profile.username}'s profile`}</span>
				<QRCodeSVG value={location} width={250} height={250} className={styles.qrcode} />
				<span className='credit'>powered by qrcode.react</span>
			</Dialog>
			<Toasty
				message='Link copied to clipboard'
				mode={linkCopied ? "short" : "hidden"}
				onClose={() => setLinkCopied(false)}
			/>

			{/* UI Listeners ^^ */}

			<header className={styles.container}>
				<div className={styles.avatar}>
					<Twemoji emoji={profile.avatar || "🙂"} />
				</div>
				<div className={styles.content}>
					<div className={styles.info}>
						<h2>{profile.username}</h2>
						<span>{profile.flavour}</span>
					</div>
					<div className={styles.links}>
						<div className={styles.socials}>{showLinks()}</div>
						<div className={styles.share}>
							<button
								type='button'
								title='copy link to clipboard'
								onClick={copyToClipboard}>
								<FaLink />
							</button>
							<button
								type='button'
								title='qrcode generator'
								onClick={() => setShowQr(true)}>
								<FaQrcode />
							</button>
						</div>
					</div>
				</div>
			</header>
		</>
	);
};

export default Header;
