import { FC } from "react";

import { HeaderFallback } from "components/dashboard/Header";
import { ListsFallback } from "components/dashboard/Lists";

const DashboardLoading: FC = () => {
	return (
		<>
			<HeaderFallback />
			<main>
				<ListsFallback />
			</main>
		</>
	);
};

export default DashboardLoading;
