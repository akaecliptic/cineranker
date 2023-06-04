import { FC } from "react";

import Header from "components/index/Header";
import Hero from "components/index/Hero";

import "styles/pages/index.scss";

const IndexPage: FC = () => {
	return (
		<>
			<Header />
			<main>
				<Hero />
			</main>
		</>
	);
};

export default IndexPage;
