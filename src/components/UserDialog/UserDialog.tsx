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
import { useDBContext } from '@/contexts/db.context';

export interface UserDialogProps {
	user: User;
}

export default function UserDialog(props: UserDialogProps) {
	const { getUser, setProficiencyExperience, setProficiencyPreference } =
		useDBContext();
	const { user: u } = props;
	const [open, setOpen] = React.useState(false);

	const user = getUser(u.id);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = (value: string) => {
		setOpen(false);
	};

	const updateExperience = (event: Event, i: number) => {
		//@ts-ignore
		setProficiencyExperience(user.id, i, event.target.value);
		//db.setUser();
	};

	const updatePreference = (event: Event, i: number) => {
		//@ts-ignore
		setProficiencyPreference(user.id, i, event.target.value);
		//db.setUser();
	};

	return (
		user && (
			<div>
				<Avatar
					alt={`${user.firstName} ${user.lastName}`}
					src={user.profilePhoto}
					onClick={handleClickOpen}
				/>
				<Dialog onClose={handleClose} open={open}>
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

						<Typography sx={{ fontSize: 14 }} gutterBottom>
							Proficiencies:
						</Typography>
						<List>
							<Divider />
							{(user.proficiencies as Proficiency[]).map(
								(p: Proficiency, i: number) => {
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
														key={`experience-${p.type}`}
														label={p.type}
														variant="outlined"
													/>
													<Box>
														<Typography sx={{ fontSize: 14 }}>
															Experience:
														</Typography>
														<Box
															sx={{
																display: 'flex',
																gap: 3,
																alignItems: 'center',
															}}
														>
															<Typography
																sx={{ fontSize: 12 }}
																color="text.secondary"
															>
																Less
															</Typography>
															<Slider
																name={`${p.type}`}
																value={p.experience}
																step={1}
																marks
																min={1}
																max={4}
																onChange={(event) => {
																	updateExperience(event, i);
																}}
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
															sx={{
																display: 'flex',
																gap: 3,
																alignItems: 'center',
															}}
														>
															<Typography
																sx={{ fontSize: 12 }}
																color="text.secondary"
															>
																Low
															</Typography>
															<Slider
																value={p.preference}
																step={1}
																marks
																min={1}
																max={4}
																onChange={(event) => {
																	updatePreference(event, i);
																}}
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
								}
							)}
						</List>
					</Box>
				</Dialog>
			</div>
		)
	);
}
