import type { FunctionalLayout } from "types/react";

type Params = { user: string };

export const generateMetadata = ({ params }: { params: Params }) => {
	return { title: params.user };
};

/* @ts-expect-error Async Server Component */
const UserLayout: FunctionalLayout = async ({ children }) => {
	return <>{children}</>;
};

export default UserLayout;
