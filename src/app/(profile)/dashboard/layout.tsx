import type { Metadata } from "next";

import type { FunctionalLayout } from "types/react";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "User dashboard",
};

const DashboardLayout: FunctionalLayout = ({ children }) => {
	return <>{children}</>;
};

export default DashboardLayout;
