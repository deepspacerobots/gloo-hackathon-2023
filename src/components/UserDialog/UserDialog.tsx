import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Experience, Proficiency, Team, User } from '@/db/types';
import {
	Box,
	Chip,
	Divider,
	List,
	ListItem,
	Slider,
	Stack,
	Typography,
} from '@mui/material';

export interface UserDialogProps {
	user: User;
}

export default function UserDialog(props: UserDialogProps) {
	const { user } = props;
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = (value: string) => {
		setOpen(false);
	};

	const updateExperience = (event: Event, newValue: number) => {
		console.log(event.target);
		//db.setUser();
	};

	const updatePreference = (event: Event, newValue: number) => {
		console.log(event.target);
		//db.setUser();
	};

	return (
		<div>
			<Avatar
				alt={`${user.firstName} ${user.lastName}`}
				src={user.profilePhoto}
				onClick={handleClickOpen}
			/>
			<Dialog onClose={handleClose} open={open}>
				<DialogTitle>User Dialog</DialogTitle>
				<Box p={2} sx={{ minWidth: 600 }}>
					<Box sx={{ display: 'flex' }}>
						<Avatar
							alt={`${user.firstName} ${user.lastName}`}
							src={user.profilePhoto}
						/>
						<Stack spacing={0.5}>
							<Typography variant="h5" component="div">
								{user.firstName} {user.lastName}
							</Typography>
							<Typography
								sx={{ fontSize: 14 }}
								color="text.secondary"
								gutterBottom
							>
								{user.role}
							</Typography>
						</Stack>
					</Box>
					<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
						Teams:
					</Typography>
					<Box sx={{ display: 'flex' }}>
						{(user.teams as Team[]).map((team: Team) => {
							return (
								<Chip
									key={`team-${team.id}`}
									label={team.title}
									variant="outlined"
								/>
							);
						})}
					</Box>
					<Typography sx={{ fontSize: 14 }} gutterBottom>
						Proficiencies:
					</Typography>
					<List>
						<Divider />
						{(user.experiences as Experience[]).map((e: Experience) => {
							return (
								<>
									<ListItem>
										<Box
											sx={{
												display: 'grid',
												gridTemplateColumns: '8rem 1fr 1fr',
												gap: 4,
											}}
										>
											<Chip
												key={`experience-${e.id}`}
												label={e.type}
												variant="outlined"
											/>
											<Box>
												<Typography sx={{ fontSize: 14 }}>
													Experience:
												</Typography>
												<Box
													sx={{ display: 'flex', gap: 3, alignItems: 'center' }}
												>
													<Typography
														sx={{ fontSize: 12 }}
														color="text.secondary"
													>
														Less
													</Typography>
													<Slider
														name={`${e.type}`}
														defaultValue={e.level}
														step={1}
														marks
														min={1}
														max={4}
														onChange={updateExperience}
														sx={{ minWidth: 80 }}
													/>
													<Typography
														sx={{ fontSize: 12 }}
														color="text.secondary"
													>
														More
													</Typography>
												</Box>
											</Box>
											<Box>
												<Typography sx={{ fontSize: 14 }}>
													Preference:
												</Typography>
												<Box
													sx={{ display: 'flex', gap: 3, alignItems: 'center' }}
												>
													<Typography
														sx={{ fontSize: 12 }}
														color="text.secondary"
													>
														Low
													</Typography>
													<Slider
														defaultValue={e.preference}
														step={1}
														marks
														min={1}
														max={4}
														onChange={updatePreference}
														sx={{ minWidth: 80 }}
													/>
													<Typography
														sx={{ fontSize: 12 }}
														color="text.secondary"
													>
														High
													</Typography>
												</Box>
											</Box>
										</Box>
									</ListItem>
									<Divider />
								</>
							);
						})}
					</List>
				</Box>
			</Dialog>
		</div>
	);
}
