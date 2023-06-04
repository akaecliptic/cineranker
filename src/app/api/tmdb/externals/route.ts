import { NextResponse } from "next/server";
import { external_ids } from "lib/tmdb";

export const GET = async (request: Request) => {
	const { searchParams } = new URL(request.url);
	const multiple = searchParams.has("ids");
	const query = (multiple ? searchParams.get("ids") : searchParams.get("id")) || null;

	if (query === null) return NextResponse.json(query);

	if (!multiple) {
		const result = await external_ids(parseInt(query));
		return NextResponse.json(result);
	}

	const ids = query.split(",");
	const results = [];
	for (let i = 0; i < ids.length; i++) {
		const result = await external_ids(parseInt(ids[i]));
		results.push(result);
	}
	return NextResponse.json(results);
};
