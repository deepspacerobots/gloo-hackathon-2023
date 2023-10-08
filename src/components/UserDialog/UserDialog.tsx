import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { User } from '@/db/types';
import './UserDialog.scss';

const emails = ['username@gmail.com', 'user02@gmail.com'];

export interface SimpleDialogProps {
	open: boolean;
	selectedValue: string;
	onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
	const { onClose, selectedValue, open } = props;

	const handleClose = () => {
		onClose(selectedValue);
	};

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>User Dialog</DialogTitle>
		</Dialog>
	);
}

export interface UserDialogProps {
	user: User;
}

export default function UserDialog(props: UserDialogProps) {
	const { user } = props;
	const [open, setOpen] = React.useState(false);
	const [selectedValue, setSelectedValue] = React.useState(emails[1]);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = (value: string) => {
		setOpen(false);
		setSelectedValue(value);
	};

	return (
		<div>
			{user.profilePhoto ? (
				<Avatar
					alt={`${user.firstName} ${user.lastName}`}
					src={user.profilePhoto}
					onClick={handleClickOpen}
				/>
			) : (
				<div className="missingProfilePhoto">
					{user.firstName.slice(0, 1)} {user.lastName.slice(0, 1)}
				</div>
			)}
			<SimpleDialog
				selectedValue={selectedValue}
				open={open}
				onClose={handleClose}
			/>
		</div>
	);
}
