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
import { Database as DatabaseType } from '@/db/db';
import { EventTeam, MinistryEvent, Role, Team, User } from '@/db/types';
import Box from '@mui/material/Box';
import { generateTeamSchedule } from '@/api/gpt-service';
import { Close } from '@mui/icons-material';
import UserDialog from '@/components/UserDialog/UserDialog';
import {
	worshipTeamSchedules,
	techTeamSchedules,
	prayerTeamSchedules,
} from '../api/example-responses';

export default function EventEditor() {
	const db = useDBContext();
	// const [events, setEvents] = useState(db.getFutureEvents());
	const events = db.getFutureEvents();
	const teams = db.getAllTeams();
	const [allVolunteers, setAllVolunteers] = useState(db.getUsers());
	const [userDragging, setUserDragging] = useState<null | User>(null);
	const [unassignedRoles, setUnassignedRoles] = useState(0);
	useEffect(() => {
		// add event teams to event
		let newTeamId = 46;
		let unassignedRolesCount = 0;
		events.forEach((event) => {
			event.teams.forEach((team) => {
				const scheduledUsersInitial: number[] = [];
				// @ts-ignore
				team.roles.forEach((a, index) => {
					scheduledUsersInitial.push(null);
					unassignedRolesCount++;
				});
				// @ts-ignore
				event.eventTeams.push({
					id: newTeamId,
					// @ts-ignore
					team: team.id,
					at_capacity: false,
					scheduled_users: scheduledUsersInitial,
				});
				newTeamId++;
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
													{events.length}
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
													{db.getUsers().length}
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
													{db.getAllTeams().length}
												</Typography>
											</div>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Box>
					</Grid>
					{events?.map((event: MinistryEvent) => (
						<EventCard
							key={event.id}
							eventId={event.id}
							eventName={event.title}
							eventDate={event.date}
							db={db}
							userDragging={userDragging}
							setUserDragging={setUserDragging}
							events={events}
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
}: {
	eventId: number;
	eventName: string;
	eventDate: string;
	db: DatabaseType;
	userDragging: null | User;
	setUserDragging: React.Dispatch<React.SetStateAction<User | null>>;
	events: MinistryEvent[];
}) {
	const db = useDBContext();
	const [isExpanded, setIsExpanded] = useState(false);

	const fadfasdfgarstgewrrhtawegrtwe = db.getEvent(eventId);
	const event = events.find((e) => e.id === eventId);
	const formattedEventDate = new Date(eventDate).toDateString();
	const teams = event?.teams as Team[];
	const teams2 = event?.eventTeams as EventTeam[];

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
						<Accordion
							className={'outerAccordion'}
							disableGutters
							expanded={!isExpanded}
							onChange={() => {
								setIsExpanded(!isExpanded);
							}}
						>
							<AccordionSummary
								style={{ height: 0, minHeight: 0 }}
							></AccordionSummary>

							<AccordionDetails>
								<Grid container spacing={2}>
									{teams?.map((team: Team) => (
										<TeamCardSecondary key={team.id} teamName={team.title} />
									))}
								</Grid>
							</AccordionDetails>
						</Accordion>
					</Stack>
				</AccordionSummary>

				<AccordionDetails>
					<Grid container rowSpacing={1} spacing={1}>
						{teams?.map((team: Team) => (
							<TeamCard
								key={team.id}
								teamName={team.title}
								roles={team.roles as number[]}
								userDragging={userDragging}
								setUserDragging={setUserDragging}
								eventId={eventId}
								teamId={team.id}
								events={events}
								event={event as MinistryEvent}
							/>
						))}
					</Grid>
				</AccordionDetails>
			</Accordion>
		</Grid>
	);
}

function TeamCard({
	teamName,
	roles,
	userDragging,
	setUserDragging,
	eventId,
	teamId,
	events,
	event,
}: {
	teamName: string;
	roles: number[];
	userDragging: null | User;
	setUserDragging: React.Dispatch<React.SetStateAction<User | null>>;
	eventId: number;
	teamId: number;
	events: MinistryEvent[];
	event: MinistryEvent;
}) {
	const db = useDBContext();
	const fullRoles = roles.map((role: number) => db.getRole(role)) as Role[];
	// const event = db.getEvent(eventId);
	const [usersInRoles, setUsersInRoles] = useState(
		Array.from(fullRoles, (role, i) => {
			return null;
		})
	);
	useEffect(() => {
		db.setScheduledUsers(teamId, eventId, [...usersInRoles]);
	}, [usersInRoles]);

	return (
		<Grid item xs={12} md={4}>
			<Card variant="outlined">
				<CardContent>
					<Typography mb={2}>Team: {teamName}</Typography>
					<TableContainer component={Paper}>
						<Table size="small">
							<TableHead>
								<TableRow>
									<TableCell>Position</TableCell>
									<TableCell>Volunteer</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{fullRoles?.map((role: Role, index) => {
									const userObj = db.getUser(
										event?.eventTeams.find((data) => data.team === teamId)
											?.scheduled_users[index]
									);
									const userName2 =
										usersInRoles[index] !== null
											? `${
													db.getUser(
														event?.eventTeams.find(
															(data) => data.team === teamId
														)?.scheduled_users[index]
													)?.firstName
											  } ${
													db.getUser(
														event?.eventTeams.find(
															(data) => data.team === teamId
														)?.scheduled_users[index]
													)?.lastName
											  }`
											: '';
									const userName =
										usersInRoles[index] !== null
											? `${db.getUser(usersInRoles[index])?.firstName} ${
													db.getUser(usersInRoles[index])?.lastName
											  }`
											: '';
									return (
										<EventPosition
											key={role.id}
											position={role.type}
											userDragging={userDragging}
											setUserDragging={setUserDragging}
											roleIndex={index}
											usersName={userName}
											setUserToEvent={() => {
												const newUsersInRoles = [...usersInRoles];
												newUsersInRoles[index] = userDragging.id;
												setUsersInRoles(newUsersInRoles);
												const newEventObj = JSON.parse(JSON.stringify(events));
												const allEventTeamsForEvent =
													newEventObj[
														newEventObj.findIndex((e) => e.id === eventId)
													].eventTeams;
												const eventTeamForEvent =
													allEventTeamsForEvent.findIndex(
														(e) => e.id === teamId
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
}: {
	position: string;
	userDragging: null | User;
	setUserDragging: React.Dispatch<React.SetStateAction<User | null>>;
	roleIndex: number;
	setUserToEvent: () => void;
	usersName: string;
}) {
	const [styles, setStyle] = useState('');
	const db = useDBContext();
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
			<TableCell component="th" scope="row">
				<Typography>{position}</Typography>
			</TableCell>

			<TableCell>
				<Typography>{usersName}</Typography>
			</TableCell>
		</TableRow>
	);
}

function VolunteerCard({
	volunteers,
	userDragging,
	setUserDragging,
}: {
	volunteers: User[];
	userDragging: null | User;
	setUserDragging: React.Dispatch<React.SetStateAction<User | null>>;
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
				chunk.push(volunteersToChunk[currentIdx]);
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

	const db = useDBContext();
	const [events, setEvents] = useState(db.getFutureEvents());
	const teams = db.getAllTeams();

	const aiAssignAll = async () => {
		// let schedules = [];
		// for (const team of teams) {
		// 	const teamSchedule = await generateTeamSchedule(team, events);
		// 	schedules.push(teamSchedule);
		// }
		console.log({
			worshipTeamSchedules,
			techTeamSchedules,
			prayerTeamSchedules,
		});
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
										<Button color="error">Unassign All</Button>
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
														onDragStart={(e) => {
															setUserDragging(user);
														}}
														onDragEnd={(e) => {}}
														item
													>
														<UserDialog user={user} />
													</Grid>
												</Tooltip>
											));
										}
									})}
								</Grid>

								<Button
									className="showMore"
									onClick={() => setNumChunks(numChunks + 1)}
								>
									Show More
								</Button>
							</CardContent>
						</Card>
					</Stack>
				</CardContent>
			</Card>
		</Grid>
	);
}
