import { FC } from "react";
import Link from "next/link";
import { FaCode, FaGithub } from "react-icons/fa";

import AE from "components/icons/AE";

import styles from "styles/modules/Footer.module.scss";

const Footer: FC = () => {
	return (
		<footer className={styles.container}>
			<Link href='https://github.com/akaecliptic/cineranker' title='source code'>
				<FaCode />
			</Link>
			<Link href='https://github.com/akaecliptic' title='dev-github'>
				<FaGithub />
			</Link>
			<Link href='https://akaecliptic.dev' title='dev-website'>
				<AE />
			</Link>
		</footer>
	);
};

export default Footer;
