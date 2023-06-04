import type { Database } from "types/supabase";
import type { PropToasty } from "components/ui/Toasty";

// More proud of this than I probably should be...

export type Tables = keyof Database["public"]["Tables"];
export type Accesses = "Insert" | "Row" | "Update";

export type DatabaseEntry<
	Table extends Tables,
	Access extends Accesses = "Row"
> = Database["public"]["Tables"][Table][Access];

export type DatabaseView = Database["public"]["Views"]["list_data"]["Row"];

export type ToastyPayload = [string | null, Exclude<PropToasty["channel"], undefined>];
