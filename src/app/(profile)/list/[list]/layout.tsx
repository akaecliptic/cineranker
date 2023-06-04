import { Metadata } from "next";

import type { FunctionalLayout } from "types/react";

export const metadata: Metadata = {
	title: "List Editor",
	description: "Edit User List",
};

const ListLayout: FunctionalLayout = ({ children }) => {
	return <>{children}</>;
};

export default ListLayout;
