import Typography from '@mui/material/Typography';
import './eventEditor.scss';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Avatar,
	Button,
	Card,
	CardContent,
	CardHeader,
	CircularProgress,
	Divider,
	FormControl,
	Grid,
	Hidden,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Paper,
	Select,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';
import { useDBContext } from '@/contexts/db.context';
import { EventTeam, MinistryEvent, Role, Team, User } from '@/db/types';
import Box from '@mui/material/Box';
import { Close } from '@mui/icons-material';
import UserDialog from '@/components/UserDialog/UserDialog';
import {
	exampleWorshipTeamSchedules,
	exampleTechTeamSchedules,
	examplePrayerTeamSchedules,
} from '../api/example-responses';
import { useGPT } from '@/hooks/useGPT';

export default function EventEditor() {
	const { db, getFutureEvents, getAllTeams, getUsers } = useDBContext();
	const futureEvents = getFutureEvents();
	const [allVolunteers, setAllVolunteers] = useState(getUsers());
	const [userDragging, setUserDragging] = useState<null | User>(null);
	const [unassignedRoles, setUnassignedRoles] = useState(0);
	const [eventsLoading, setEventsLoading] = useState(false);

	useEffect(() => {
		// add event teams to event
		let unassignedRolesCount = 0;
		futureEvents.forEach((event) => {
			event.teams.forEach((team) => {
				// @ts-ignore
				team.roles_required.forEach((a, index) => {
					unassignedRolesCount++;
				});
			});

			setUnassignedRoles(unassignedRolesCount);
		});
	}, []);

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} md={8}>
				<Grid container rowSpacing={1}>
					<Grid item xs={12}>
						<Box>
							<Card>
								{/*<CardHeader title={'Overview'} />*/}
								<CardContent>
									<Typography variant={'h6'}>Overview</Typography>
									<Divider />
									<Grid container>
										<Grid item sm={6} md={3}>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													flexDirection: 'column',
												}}
											>
												<Typography variant={'h6'}>Events</Typography>
												<Typography variant={'h2'} color={'success.main'}>
													{futureEvents.length}
												</Typography>
											</div>
										</Grid>
										<Grid item sm={6} md={3}>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													flexDirection: 'column',
												}}
											>
												<Typography variant={'h6'}>Unassigned</Typography>
												<Typography
													variant={'h2'}
													color={
														unassignedRoles === 0
															? 'success.main'
															: 'error.main'
													}
												>
													{unassignedRoles}
												</Typography>
											</div>
										</Grid>
										<Grid item sm={6} md={3}>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													flexDirection: 'column',
												}}
											>
												<Typography variant={'h6'}>Volunteers</Typography>
												<Typography variant={'h2'} color={'success.main'}>
													{getUsers().length}
												</Typography>
											</div>
										</Grid>
										<Grid item sm={6} md={3}>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													flexDirection: 'column',
												}}
											>
												<Typography variant={'h6'}>Teams</Typography>
												<Typography variant={'h2'} color={'success.main'}>
													{getAllTeams().length}
												</Typography>
											</div>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Box>
					</Grid>
					{futureEvents?.map((event: MinistryEvent) => (
						<EventCard
							key={event.id}
							eventId={event.id}
							eventName={event.title}
							eventDate={event.date}
							userDragging={userDragging}
							setUserDragging={setUserDragging}
							events={futureEvents}
							eventsLoading={eventsLoading}
						/>
					))}
				</Grid>
			</Grid>
			<Hidden mdDown>
				<Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
					<VolunteerCard
						volunteers={allVolunteers}
						userDragging={userDragging}
						setUserDragging={setUserDragging}
						setEventsLoading={setEventsLoading}
					/>
				</Grid>
			</Hidden>
		</Grid>
	);
}

function EventCard({
	eventId,
	eventName,
	eventDate,
	userDragging,
	setUserDragging,
	events,
	eventsLoading,
}: {
	eventId: number;
	eventName: string;
	eventDate: string;
	userDragging: null | User;
	setUserDragging: React.Dispatch<React.SetStateAction<User | null>>;
	events: MinistryEvent[];
	eventsLoading: boolean;
}) {
	const { db, getEvent, getAllEvents } = useDBContext();
	const [isExpanded, setIsExpanded] = useState(false);

	const event = getEvent(eventId);
	const formattedEventDate = new Date(eventDate).toDateString();
	const teams = event?.teams as Team[];

	return (
		<Grid item xs={12}>
			<Accordion
				expanded={isExpanded}
				onChange={() => {
					setIsExpanded(!isExpanded);
				}}
			>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Stack style={{ width: '100%' }}>
						<Typography>
							{eventName} - {formattedEventDate}
						</Typography>
					</Stack>
				</AccordionSummary>

				<AccordionDetails>
					{eventsLoading ? (
						<div className="loadingContainer">
							<CircularProgress color="secondary" />
						</div>
					) : (
						<Grid container rowSpacing={1} spacing={1}>
							{teams?.map((team: Team) => (
								<TeamCard
									key={team.id}
									teamName={team.title}
									roles={team.roles as number[]}
									roles_required={team.roles_required as number[]}
									userDragging={userDragging}
									setUserDragging={setUserDragging}
									eventId={eventId}
									teamId={team.id}
									events={events}
									event={event as MinistryEvent}
								/>
							))}
						</Grid>
					)}
				</AccordionDetails>
			</Accordion>
		</Grid>
	);
}

function TeamCard({
	teamName,
	roles,
	roles_required,
	userDragging,
	setUserDragging,
	eventId,
	teamId,
	events,
	event,
}: {
	teamName: string;
	roles: number[];
	roles_required: number[];
	userDragging: null | User;
	setUserDragging: React.Dispatch<React.SetStateAction<User | null>>;
	eventId: number;
	teamId: number;
	events: MinistryEvent[];
	event: MinistryEvent;
}) {
	const { setScheduledUsers, batchUpdateScheduledUsers, getRole, getUser } =
		useDBContext();
	const fullRoles = roles_required.map((role: number) =>
		getRole(role)
	) as Role[];

	const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		if (userDragging === null) {
			setDisabled(false);
			return;
		}

		const teams = userDragging.teams;

		if (teams) {
			setDisabled(!(userDragging?.teams as number[])?.includes(teamId));
		}
	}, [userDragging]);

	return (
		<Grid item xs={12} md={4}>
			<Card variant="outlined">
				<CardContent className={disabled ? 'disabled' : ''}>
					<Typography mb={2}>Team: {teamName}</Typography>
					<TableContainer component={Paper} className="teamTable">
						<Table size="small">
							<TableHead>
								<TableRow>
									<TableCell sx={{ fontSize: "0.8rem", fontWeight: "bold", opacity: 0.8 }}>Position</TableCell>
									<TableCell></TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{fullRoles?.map((role: Role, index) => {
									//@ts-ignore
									const eventTeam = event?.eventTeams.find(
										(data: any): data is EventTeam =>
											typeof data === 'object' && data.team === teamId
									);

									const userId = eventTeam?.scheduled_users?.[index];

									let userName = '';
									let userFirst = '';
									let userLast = '';
									let profilePic = '';
									
									if (typeof userId === 'number') {
										const user = getUser(userId);
										userName = user ? `${user.firstName} ${user.lastName}` : '';
										userFirst = user?.firstName as string;
										userLast = user?.lastName as string;
										profilePic = user?.profilePhoto as string;
									}

									return (
										<EventPosition
											key={index}
											position={role.type}
											userDragging={userDragging}
											setUserDragging={setUserDragging}
											roleIndex={index}
											usersName={userName}
											userFirstName={userFirst}
											userLastName={userLast}
											userProfilePhoto={profilePic as string}
											setUserToEvent={() => {
												//@ts-ignore
												const newUsersInRoles = [
													...event?.eventTeams.find(
														(data: any): data is EventTeam => typeof data === 'object' && data.team === teamId
													)?.scheduled_users || [],
												];
												//@ts-ignore
												newUsersInRoles[index] = userDragging.id;
												batchUpdateScheduledUsers([
													{ teamId, eventId, users: [...newUsersInRoles] },
												]);
												const newEventObj = JSON.parse(JSON.stringify(events));
												const allEventTeamsForEvent =
													newEventObj[
														newEventObj.findIndex((e: any) => e.id === eventId)
													].eventTeams;
												const eventTeamForEvent =
													allEventTeamsForEvent.findIndex(
														(e: any) => e.id === teamId
													);
											}}
										/>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
				</CardContent>
			</Card>
		</Grid>
	);
}

function TeamCardSecondary({ teamName }: { teamName: string }) {
	return (
		<Grid item xs={12} md={4}>
			<Card variant="outlined">
				<CardContent>
					<Typography mb={2}>Team: {teamName}</Typography>
				</CardContent>
			</Card>
		</Grid>
	);
}

function EventPosition({
	position,
	userDragging,
	setUserDragging,
	roleIndex,
	setUserToEvent,
	usersName,
	userFirstName,
	userLastName,
	userProfilePhoto,
}: {
	position: string;
	userDragging: null | User;
	setUserDragging: React.Dispatch<React.SetStateAction<User | null>>;
	roleIndex: number;
	setUserToEvent: () => void;
	usersName: string;
	userFirstName: string;
	userLastName: string;
	userProfilePhoto: string;
}) {
	const [styles, setStyle] = useState('');
	//const db = useDBContext();
	const { db } = useDBContext();
	const [displayName, setDisplayName] = useState('');
	return (
		<TableRow
			key={position}
			className={styles}
			onDragLeave={(e) => {
				e.preventDefault();
				setStyle('');
				setDisplayName('');
			}}
			onDragEnter={(e) => {
				e.preventDefault();
				setStyle('dragOver');
			}}
			onDragOver={(e) => {
				e.preventDefault();
			}}
			onDrop={(e) => {
				e.preventDefault();
				setUserDragging(null);
				setStyle('');
				setUserToEvent();
			}}
		>
			{/* <TableCell component="th" scope="row">
				<Typography>{position}</Typography>
			</TableCell> */}

			<TableCell component="th" scope="row" sx={{ '&:hover': { cursor: 'pointer' } }}>
				<div>
					<Typography>{position}</Typography>
				</div>
				{usersName.length ? (
					<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
						{usersName.length ? (
							<Tooltip
								title={usersName}
								key={`avatar ${usersName}`}
							>
								<UserDialog
									user={{
										firstName: userFirstName,
										lastName: userLastName,
										profilePhoto: userProfilePhoto
									}}
								/>
							</Tooltip>
						): null}
						<Typography>{usersName}</Typography>
					</div>
				) : null}
			</TableCell>
			<TableCell>
				{/* <Typography>{position}</Typography> */}
			</TableCell>
		</TableRow>
	);
}

function VolunteerCard({
	volunteers,
	userDragging,
	setUserDragging,
	setEventsLoading,
}: {
	volunteers: User[];
	userDragging: null | User;
	setUserDragging: React.Dispatch<React.SetStateAction<User | null>>;
	setEventsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const chunkVolunteers = (volunteersToChunk: User[]): User[][] => {
		const chunkSize = 30;
		const maxChunks = Math.ceil(volunteersToChunk.length / chunkSize);
		const chunkedVolunteers: User[][] = [];
		let chunk: User[] = [];

		for (let i = 0; i < maxChunks; i++) {
			chunk = [];

			for (let j = 0; j < chunkSize; j++) {
				const currentIdx = i * chunkSize + j;

				if (volunteersToChunk[currentIdx]) {
					chunk.push(volunteersToChunk[currentIdx]);
				}
			}

			chunkedVolunteers.push(chunk);
		}

		return chunkedVolunteers;
	};

	const [filter, setFilter] = useState(0);
	const [filteredVolunteers, setFilteredVolunteers] = useState<User[][]>(
		chunkVolunteers(volunteers)
	);
	const [volunteerFilterInputValue, setVolunteerFilterInputValue] =
		useState('');
	const [numChunks, setNumChunks] = useState(1);

	const filterVolunteersByTeam = (): User[] => {
		if (filter === 0) {
			return volunteers;
		}

		return volunteers.filter((volunteer: User) => {
			//@ts-ignore
			return volunteer.teams.find((team: Team | number) => {
				if (typeof team === 'number') {
					return team === filter;
				}

				return team.id === filter;
			});
		});
	};

	const filterVolunteersByName = (volunteersByTeam: User[]): User[] => {
		return volunteersByTeam.filter((volunteer) => {
			return (
				volunteer.firstName
					.toLowerCase()
					.includes(volunteerFilterInputValue.toLowerCase()) ||
				volunteer.lastName
					.toLowerCase()
					.includes(volunteerFilterInputValue.toLowerCase())
			);
		});
	};

	useEffect(() => {
		const filteredVolunteersByTeam = filterVolunteersByTeam();
		const filteredVolunteersByName = filterVolunteersByName(
			filteredVolunteersByTeam
		);

		const chunkedVolunteers = chunkVolunteers(filteredVolunteersByName);
		setFilteredVolunteers(chunkedVolunteers);
	}, [filter, volunteerFilterInputValue, numChunks]);

	const { getFutureEvents, getAllTeams, batchUpdateScheduledUsers } =
		useDBContext();
	const { generateTeamSchedule } = useGPT();
	const [futureEvents, setEvents] = useState(getFutureEvents());
	const teams = getAllTeams();

	const aiAssignAll = async () => {
		setEventsLoading(true);
		// Not reliable yet. Team three often gives a bad response and throws an error :( "SyntaxError: Unexpected token 'B', "Based on t"... is not valid JSON"
		// Also, worship team responses are still wonky. Ex. scheduling TWO bass players. Maybe GPT4 model would be better?
		// let schedules = [];
		// for (const team of teams) {

		// 	const teamSchedule = await generateTeamSchedule(team, futureEvents);
		// 	console.log(teamSchedule)
		// 	schedules.push(teamSchedule);
		// }
		// console.log({schedules})

		setTimeout(() => {
			const worshipSchedules = exampleWorshipTeamSchedules.events.map(
				(event) => {
					return {
						teamId: event.eventTeam.team,
						eventId: event.id,
						users: event.eventTeam.scheduled_users.map((user) => user.id),
					};
				}
			);
			const techSchedules = exampleTechTeamSchedules.events.map((event) => {
				return {
					teamId: event.eventTeam.team,
					eventId: event.id,
					users: event.eventTeam.scheduled_users.map((user) => user.id),
				};
			});
			const prayerSchedules = examplePrayerTeamSchedules.events.map((event) => {
				return {
					teamId: event.eventTeam.team,
					eventId: event.id,
					users: event.eventTeam.scheduled_users.map((user) => user.id),
				};
			});

			batchUpdateScheduledUsers([
				...worshipSchedules,
				...techSchedules,
				...prayerSchedules,
			]);

			setEventsLoading(false);
		}, 3500);
	};

	const unassignAll = () => {
		const clearedSchedules = futureEvents.flatMap((event) =>
			event.teams.map((team) => ({
				teamId: (team as Team).id,
				eventId: event.id,
				users: [],
			}))
		);
		batchUpdateScheduledUsers(clearedSchedules);
	};

	return (
		<Grid item className={'volunteerCard'}>
			<Card variant="outlined">
				<CardContent>
					{/*<CardHeader title={'Assign Volunteers'}></CardHeader>*/}
					<Stack spacing={1}>
						{/*Assistant Card*/}
						<Card>
							<CardHeader
								title={'Assistant'}
								subheader={'Let AI assign your volunteers'}
							/>

							<CardContent>
								<Grid container spacing={1}>
									<Grid item>
										<Button
											variant="contained"
											color="success"
											onClick={() => {
												aiAssignAll();
											}}
										>
											Assign All
										</Button>
									</Grid>

									<Grid item>
										<Button color="error" onClick={() => unassignAll()}>
											Unassign All
										</Button>
									</Grid>
								</Grid>
							</CardContent>
						</Card>

						{/*Filter Card*/}
						<Card>
							<CardHeader
								title={'Filter'}
								subheader={'See only who is part of a selected team'}
							/>

							<CardContent>
								<FormControl fullWidth>
									<InputLabel>Team</InputLabel>
									<Select
										size="small"
										value={filter}
										label="Team"
										//@ts-ignore
										onChange={(e) => setFilter(e.target.value)}
									>
										<MenuItem value={0}>All Teams</MenuItem>
										<MenuItem value={1}>Worship Team</MenuItem>
										<MenuItem value={2}>Tech Team</MenuItem>
										<MenuItem value={3}>Pastoral Care Team</MenuItem>
									</Select>
								</FormControl>

								<Button
									color="error"
									onClick={() => setFilter(0)}
									disabled={filter === 0}
								>
									Reset
								</Button>
							</CardContent>
						</Card>

						{/*Available Volunteers Card*/}
						<Card>
							<CardHeader
								title={'Available Volunteers'}
								subheader={'Click and drag volunteers to manually assign them'}
							/>

							<CardContent className="volunteersDisplay">
								<Box mb={2} className="searchInput">
									<FormControl fullWidth>
										<InputLabel
											size={'small'}
											htmlFor="search-for-volunteer-input"
										>
											Search For Volunteer
										</InputLabel>

										<OutlinedInput
											id={'search-for-volunteer-input'}
											value={volunteerFilterInputValue}
											size={'small'}
											label={'Search For Volunteer'}
											endAdornment={
												<InputAdornment position="end">
													<IconButton
														size={'small'}
														onClick={() => {
															setVolunteerFilterInputValue('');
														}}
													>
														<Close fontSize="inherit" />
													</IconButton>
												</InputAdornment>
											}
											onChange={(e) => {
												setVolunteerFilterInputValue(e.target.value);
											}}
										/>
									</FormControl>
								</Box>

								<Grid
									container
									rowSpacing={1}
									spacing={1}
									className="volunteerGrid"
								>
									{filteredVolunteers.map((chunk, chunkIdx) => {
										if (chunkIdx < numChunks) {
											return chunk.map((user: User) => (
												<Tooltip
													title={`${user.firstName} ${user.lastName}`}
													key={`avatar ${user.id}`}
												>
													<Grid
														draggable
														onDragStart={() => setUserDragging(user)}
														onDragEnd={() => setUserDragging(null)}
														item
													>
														<UserDialog user={user} />
													</Grid>
												</Tooltip>
											));
										}
									})}
								</Grid>

								{filteredVolunteers.length > numChunks && (
									<Button
										className="showMore"
										onClick={() => setNumChunks(numChunks + 1)}
									>
										Show More
									</Button>
								)}
							</CardContent>
						</Card>
					</Stack>
				</CardContent>
			</Card>
		</Grid>
	);
}
