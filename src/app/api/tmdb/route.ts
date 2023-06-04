import { NextResponse } from "next/server";
import { search } from "lib/tmdb";

export const GET = async (request: Request) => {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("search") || null;

	if (query === null) return NextResponse.json(query);

	const results = await search(query);
	return NextResponse.json(results);
};
