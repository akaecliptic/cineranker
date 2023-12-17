"use client";

import { ChangeEvent, FC, useState } from "react";

type Passwords = {
	new: string;
	confirm: string;
};

const isPasswordValid = (value: string) => {
	return value.replace(/\s/g, "").length !== 0 && !value.includes(" ");
};

export type PropPanelUser = {
	updatePassword: (value: string | null, cause?: string) => Promise<void>;
	deleteAccount: () => Promise<void>;
};

const PanelUser: FC<PropPanelUser> = ({ updatePassword, deleteAccount }) => {
	const [passwords, updatePasswords] = useState<Passwords>(() => ({
		new: "",
		confirm: "",
	}));

	const onSaveHandle = () => {
		if (passwords.new !== passwords.confirm) {
			updatePassword(null, "Passwords do not match");
		} else if (!isPasswordValid(passwords.new) || !isPasswordValid(passwords.confirm)) {
			updatePassword(null, "Invalid password");
		} else {
			updatePassword(passwords.new);
		}
	};

	const onDeleteHandle = () => {
		if (confirm("Confirming will delete your account?")) {
			deleteAccount();
		}
	};

	const onPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
		const key = event.target.name;
		const value = event.target.value;
		updatePasswords((old) => ({ ...old, [key]: value }));
	};

	return (
		<div className='container'>
			<form name='change password'>
				<div className='fields'>
					<label htmlFor='new'>new password</label>
					<input
						id='new-password'
						type='password'
						name='new'
						maxLength={25}
						title='new password'
						onChange={onPasswordChange}
					/>
				</div>
				<div className='fields'>
					<label htmlFor='confirm'>confirm password</label>
					<input
						id='confirm-password'
						type='password'
						name='confirm'
						maxLength={25}
						title='confirm password'
						onChange={onPasswordChange}
					/>
				</div>
			</form>
			<div className='button-bar'>
				<button type='submit' title='save' className='save' onClick={onSaveHandle}>
					save
				</button>
				<button
					type='button'
					title='delete account'
					className='delete'
					onClick={onDeleteHandle}>
					delete this
				</button>
			</div>
		</div>
	);
};

export default PanelUser;
