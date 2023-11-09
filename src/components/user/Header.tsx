"use client";

import { FC, useEffect, useState } from "react";
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

import Twemoji from "components/icons/Twemoji";
import Dialog from "components/ui/Dialog";
import Toasty from "components/ui/Toasty";

import type { DatabaseEntry } from "types/auxil";

import styles from "styles/modules/UserHeader.module.scss";

export const HeaderFallback: FC<{}> = () => {
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

export type PropHeader = {
	profile: DatabaseEntry<"Profiles">;
};

const Header: FC<PropHeader> = ({ profile }) => {
	const [showQr, setShowQr] = useState<boolean>(false);
	const [linkCopied, setLinkCopied] = useState<boolean>(false);
	const [location, setLocation] = useState<string>("");

	const copyToClipboard = () => {
		navigator.clipboard.writeText(location);
		setLinkCopied(true);
	};

	const showLinks = (): JSX.Element[] => {
		const elements: JSX.Element[] = [];
		const links = profile.links || [];

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
		setLocation(window.location.href);
	}, []);

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
