import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { Database } from "types/supabase";

export const middleware = async (req: NextRequest) => {
	const res = NextResponse.next();
	const supabase = createMiddlewareSupabaseClient<Database>({ req, res });
	await supabase.auth.getSession();
	return res;
};
