"use client";

import { FC, useState } from "react";
import { FaChevronRight, FaTimes } from "react-icons/fa";
import Link from "next/link";

import Toasty from "components/ui/Toasty";
import Twemoji from "components/icons/Twemoji";
import CreateList, { CreateListFallback } from "components/dashboard/CreateList";
import EditableAvatar from "components/dashboard/EditableAvatar";
import EditableSocial from "components/dashboard/EditableSocial";
import { useSupabase } from "components/auxil/SupabaseProvider";

import type { DatabaseEntry, ToastyPayload } from "types/auxil";

type ProfileKey = Exclude<keyof DatabaseEntry<"Profiles">, "links">;

export const HeaderFallback: FC = () => {
	return (
		<header className='top'>
			<button id='open-edit-tab' type='button' title='loading profile...'>
				<Twemoji emoji='⏳' />
			</button>
			<CreateListFallback />
		</header>
	);
};

const dummyProfile: DatabaseEntry<"Profiles"> = {
	user_id: "",
	avatar: "🚫",
	username: "",
	flavour: "",
	accent: null,
	links: ["", "", ""],
};

export type PropHeader = {
	initial: DatabaseEntry<"Profiles"> | null;
	count: number;
};

const Header: FC<PropHeader> = ({ initial, count }) => {
	const [openTab, setOpenTab] = useState<boolean>(false);
	const [profile, setProfile] = useState<DatabaseEntry<"Profiles">>(initial || dummyProfile);
	const [links, setLinks] = useState<string[]>(dummyProfile.links!);
	const [payload, setPayload] = useState<ToastyPayload>([null, "info"]);

	const { supabase, session } = useSupabase();

	const saveProfile = async () => {
		if (session === null) return;

		if (profile.username.replace(/\s/g, "") === "") {
			setPayload(() => ["Invalid 'username'", "alert"]);
			return;
		}

		const { error } = await supabase.from("Profiles").upsert({
			user_id: session.user.id,
			username: profile.username,
			accent: profile.accent,
			avatar: profile.avatar,
			flavour: profile.flavour,
			links: profile.links,
		});

		if (error) {
			console.error("Error saving user profile, with code:", error.code);
			setPayload(() => ["Saving profile failed", "alert"]);
			return;
		}

		setPayload(() => ["Profile saved", "info"]);
	};

	const updateProfile = (key: ProfileKey, value: string): void => {
		setProfile((old) => {
			old![key] = value;
			return old;
		});
	};

	const updateLinks = (index: number, value: string) => {
		setLinks((old) => {
			old.splice(index, 0, value);
			return old;
		});
		setProfile((old) => {
			old!.links = links;
			return old;
		});
	};

	return (
		<>
			<Toasty
				message={payload[0] || ""}
				mode={payload[0] ? "long" : "hidden"}
				channel={payload[1]}
				onClose={() => setPayload([null, "info"])}
			/>

			<header className='top'>
				<button
					id='open-edit-tab'
					type='button'
					title='open profile tab'
					onClick={() => setOpenTab(true)}>
					<FaChevronRight />
					<Twemoji emoji={profile.avatar!} />
				</button>

				<div className='action-buttons'>
					<Link href={`/${profile.username}`}>
						<button type='button' title='user profile'>
							profile
						</button>
					</Link>
					<CreateList count={count} />
				</div>
			</header>

			<aside id='edit-profile-tab' className={openTab ? "open" : ""}>
				<button
					type='reset'
					className='close'
					title='close'
					onClick={() => setOpenTab(false)}>
					<FaTimes />
				</button>
				<div className='container'>
					<EditableAvatar
						initial={profile.avatar!}
						onSelect={(emoji) => updateProfile("avatar", emoji)}
					/>
					<div className='fields'>
						<label htmlFor='edit-username'>Username</label>
						<input
							id='edit-username'
							type='text'
							name='username'
							maxLength={25}
							title='username'
							placeholder='Username'
							defaultValue={profile.username!}
							onChange={(event) =>
								updateProfile("username", event.currentTarget.value)
							}
						/>
					</div>
					<div className='fields'>
						<label htmlFor='edit-flavour'>About you</label>
						<textarea
							id='edit-flavour'
							name='flavour'
							maxLength={150}
							title='About you'
							placeholder='About you'
							defaultValue={profile.flavour!}
							rows={3}
							onChange={(event) =>
								updateProfile("flavour", event.currentTarget.value)
							}
						/>
					</div>
					<div className='fields'>
						<label>Personal Links</label>
						<EditableSocial
							initial={profile.links![0]}
							onChange={(value) => updateLinks(0, value)}
						/>
						<EditableSocial
							initial={profile.links![1]}
							onChange={(value) => updateLinks(1, value)}
						/>
						<EditableSocial
							initial={profile.links![2]}
							onChange={(value) => updateLinks(2, value)}
						/>
					</div>
					<div>
						<button type='button' title='save' onClick={saveProfile} className='save'>
							save
						</button>
					</div>
				</div>
			</aside>
		</>
	);
};

export default Header;
