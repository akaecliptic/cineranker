"use client";

import { FC, useState, useEffect } from "react";
import { FaChevronLeft, FaTimes } from "react-icons/fa";
import { notFound } from "next/navigation";

import Toasty from "components/ui/Toasty";
import Twemoji from "components/icons/Twemoji";
import EditableAvatar from "components/dashboard/EditableAvatar";
import EditableSocial from "components/dashboard/EditableSocial";
import { useSupabase } from "components/auxil/SupabaseProvider";

import type { DatabaseEntry, ToastyPayload } from "types/auxil";

type ProfileKey = Exclude<keyof DatabaseEntry<"Profiles">, "links">;

const HeaderLoading: FC = () => {
	return (
		<header className='top'>
			<button id='open-edit-tab' type='button' title='loading profile...'>
				<Twemoji emoji='⏳' />
			</button>
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

const Header: FC<{}> = () => {
	const [openTab, setOpenTab] = useState<boolean>(false);
	const [profile, setProfile] = useState<DatabaseEntry<"Profiles">>();
	const [links, setLinks] = useState<string[]>(dummyProfile.links!);
	const [payload, setPayload] = useState<ToastyPayload>([null, "info"]);

	const { supabase, session } = useSupabase();

	const saveProfile = async () => {
		if (session === null || !profile) return;

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

	useEffect(() => {
		if (!session) return;
		(async () => {
			const { data, error } = await supabase
				.from("Profiles")
				.select("*")
				.eq("user_id", session.user.id)
				.single();

			if (error) {
				console.error("There was an error fetching user: '%s'", error.message);
				notFound();
			} else if (!data) {
				console.error("User could not be found, redirecting to home page");
				notFound();
			}

			setProfile(data);
		})();
	}, [supabase, session]);

	if (!profile) return <HeaderLoading />;

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
					<FaChevronLeft />
					<Twemoji emoji={profile.avatar!} />
				</button>
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
