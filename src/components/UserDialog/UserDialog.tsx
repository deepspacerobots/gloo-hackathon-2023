import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { User } from '@/db/types';

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
			<Avatar
				alt={`${user.firstName} ${user.lastName}`}
				src={user.profilePhoto}
				onClick={handleClickOpen}
			/>
			<SimpleDialog
				selectedValue={selectedValue}
				open={open}
				onClose={handleClose}
			/>
		</div>
	);
}
