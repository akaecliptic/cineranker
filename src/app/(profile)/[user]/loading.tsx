import { FC } from "react";

import { HeaderFallback } from "components/user/Header";

const UserLoading: FC<{}> = () => {
	return (
		<>
			<HeaderFallback />
			<main></main>
		</>
	);
};

export default UserLoading;
