"use client";

import { FC, useState, useEffect } from "react";
import { FaChevronLeft, FaTimes } from "react-icons/fa";
import { notFound } from "next/navigation";

import Toasty from "components/ui/Toasty";
import Twemoji from "components/icons/Twemoji";
import PanelUser from "components/dashboard/PanelUser";
import PanelProfile from "components/dashboard/PanelProfile";

import { useSupabase } from "components/auxil/SupabaseProvider";

import type { DatabaseEntry, ToastyPayload } from "types/auxil";

const HeaderLoading: FC = () => {
	return (
		<header className='dashboard'>
			<button id='open-edit-tab' type='button' title='loading profile...'>
				<Twemoji emoji='⏳' />
			</button>
		</header>
	);
};

const Header: FC = () => {
	const { supabase, session } = useSupabase();

	const [openTab, setOpenTab] = useState<boolean>(false);
	const [profile, setProfile] = useState<DatabaseEntry<"Profiles">>();
	const [payload, setPayload] = useState<ToastyPayload>([null, "info"]);
	const [editProfile, setEditProfile] = useState<boolean>(true);

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

	const updatePassword = async (value: string | null, cause?: string) => {
		if (session === null) return;

		if (value === null) {
			setPayload(() => [cause!, "alert"]);
			return;
		}

		const { error } = await supabase.auth.updateUser({ password: value });

		if (error) {
			console.error("Error updating user password: '%s'", error.message);
			setPayload(() => ["Updating password failed", "alert"]);
			return;
		}

		setPayload(() => ["Password updated", "info"]);
	};

	const deleteAccount = async () => {
		if (session === null) return;

		const { error } = await supabase.auth.updateUser({ data: { deleted: true } });

		if (error) {
			console.error("Error deleting user profile: '%s'", error.message);
			setPayload(() => ["Deleting profile failed", "alert"]);
			return;
		}

		supabase.auth.signOut();
	};

	const toggleEditTab = (value: boolean) => {
		if (value === editProfile) return;
		setEditProfile(value);
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

			<header className='dashboard'>
				{!openTab && (
					<button
						id='open-edit-tab'
						type='button'
						title='open profile tab'
						onClick={() => {
							setOpenTab(true);
							setEditProfile(true);
						}}>
						<FaChevronLeft />
						<Twemoji emoji={profile.avatar!} />
					</button>
				)}
			</header>

			<aside id='edit-profile-tab' className={openTab ? "open" : ""}>
				<button
					type='reset'
					className='close'
					title='close'
					onClick={() => setOpenTab(false)}>
					<FaTimes />
				</button>
				<div className='toggle-bar'>
					<button
						type='button'
						title='user'
						className={editProfile ? "toggled" : "toggle"}
						onClick={() => toggleEditTab(true)}>
						Edit Profile
					</button>
					<button
						type='button'
						title='user'
						className={!editProfile ? "toggled" : "toggle"}
						onClick={() => toggleEditTab(false)}>
						Edit User
					</button>
				</div>
				{editProfile ? (
					<PanelProfile
						profile={profile}
						setProfile={setProfile}
						saveProfile={saveProfile}
					/>
				) : (
					<PanelUser updatePassword={updatePassword} deleteAccount={deleteAccount} />
				)}
			</aside>
		</>
	);
};

export default Header;
