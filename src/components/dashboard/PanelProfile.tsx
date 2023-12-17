"use client";

import { Dispatch, FC, SetStateAction, useState } from "react";

import EditableAvatar from "components/dashboard/EditableAvatar";
import EditableSocial from "components/dashboard/EditableSocial";

import type { DatabaseEntry } from "types/auxil";

type ProfileKey = Exclude<keyof DatabaseEntry<"Profiles">, "links">;

export type PropPanelProfile = {
	profile: DatabaseEntry<"Profiles">;
	setProfile: Dispatch<SetStateAction<DatabaseEntry<"Profiles"> | undefined>>;
	saveProfile: () => Promise<void>;
};

const PanelProfile: FC<PropPanelProfile> = ({ profile, setProfile, saveProfile }) => {
	const [links, setLinks] = useState<string[]>([]);

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
		<div className='container'>
			<EditableAvatar
				initial={profile.avatar}
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
					defaultValue={profile.username}
					onChange={(event) => updateProfile("username", event.currentTarget.value)}
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
					onChange={(event) => updateProfile("flavour", event.currentTarget.value)}
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
			<button type='button' title='save' onClick={saveProfile} className='save'>
				save
			</button>
		</div>
	);
};

export default PanelProfile;
