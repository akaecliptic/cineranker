import { FC } from "react";

import { ButtonBarFallback } from "components/list/ButtonBar";
import { ContainerFallback } from "components/list/Container";
import { HeaderFallback } from "components/list/Header";

const ListLoading: FC = () => {
	return (
		<>
			<HeaderFallback />
			<main>
				<ContainerFallback />
				<ButtonBarFallback />
			</main>
		</>
	);
};

export default ListLoading;
