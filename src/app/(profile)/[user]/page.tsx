import { FC } from "react";

import Card from "components/user/Card";
import Header from "components/user/Header";

const UserPage: FC = () => {
	return (
		<>
			<main>
				<Header />
				<Card />
			</main>
		</>
	);
};

export default UserPage;
