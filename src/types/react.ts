export type FunctionalLayout<Parameter = {}> = ({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Parameter;
}) => JSX.Element;

export type DynamicSegment<Parameter> = ({ params }: { params: Parameter }) => JSX.Element;
