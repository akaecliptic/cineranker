import { FC } from "react";

import Header from "components/index/Header";
import Main from "components/index/Main";

import "styles/pages/index.scss";

const IndexPage: FC = () => {
	return (
		<>
			<Header />
			<Main />
		</>
	);
};

export default IndexPage;
