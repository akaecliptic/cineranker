export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
	public: {
		Tables: {
			Lists: {
				Row: {
					_id: number;
					created_at: string;
					index: number | null;
					title: string;
					user_id: string;
				};
				Insert: {
					_id?: number;
					created_at?: string;
					index?: number | null;
					title: string;
					user_id: string;
				};
				Update: {
					_id?: number;
					created_at?: string;
					index?: number | null;
					title?: string;
					user_id?: string;
				};
			};
			Lists_To_Movies: {
				Row: {
					list_id: number;
					movie_id: number;
					rank: number | null;
					user_id: string;
				};
				Insert: {
					list_id: number;
					movie_id: number;
					rank?: number | null;
					user_id: string;
				};
				Update: {
					list_id?: number;
					movie_id?: number;
					rank?: number | null;
					user_id?: string;
				};
			};
			Movies: {
				Row: {
					imdb_id: string | null;
					poster: string | null;
					title: string;
					tmdb_id: number;
					year: number;
				};
				Insert: {
					imdb_id?: string | null;
					poster?: string | null;
					title: string;
					tmdb_id?: number;
					year: number;
				};
				Update: {
					imdb_id?: string | null;
					poster?: string | null;
					title?: string;
					tmdb_id?: number;
					year?: number;
				};
			};
			Profiles: {
				Row: {
					accent: string | null;
					avatar: string;
					flavour: string | null;
					links: string[] | null;
					user_id: string;
					username: string;
				};
				Insert: {
					accent?: string | null;
					avatar?: string;
					flavour?: string | null;
					links?: string[] | null;
					user_id: string;
					username: string;
				};
				Update: {
					accent?: string | null;
					avatar?: string;
					flavour?: string | null;
					links?: string[] | null;
					user_id?: string;
					username?: string;
				};
			};
			Reactions: {
				Row: {
					list_id: number;
					reaction: string;
					user_id: string;
				};
				Insert: {
					list_id: number;
					reaction: string;
					user_id: string;
				};
				Update: {
					list_id?: number;
					reaction?: string;
					user_id?: string;
				};
			};
		};
		Views: {
			list_data: {
				Row: {
					_id: number | null;
					imdb_id: string | null;
					list: string | null;
					poster: string | null;
					rank: number | null;
					title: string | null;
					tmdb_id: number | null;
					user_id: string | null;
					year: number | null;
				};
			};
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
