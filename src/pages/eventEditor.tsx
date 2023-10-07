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
import { MinistryEvent, Role, Team, User } from '@/db/types';
import Box from '@mui/material/Box';
import { generateTeamSchedule } from '@/api/gpt-service';
import { Close } from '@mui/icons-material';
import UserDialog from '@/components/UserDialog/UserDialog';

export default function EventEditor() {
	const db = useDBContext();
	const [events, setEvents] = useState(db.getFutureEvents());
	const teams = db.getAllTeams();
	// starting to test schedule generation, just team 1 users
	generateTeamSchedule(teams[0], events);
	const [allVolunteers, setAllVolunteers] = useState(db.getUsers());
	const [userDragging, setUserDragging] = useState<null | User>(null);
	useEffect(() => {
		// add event teams to event
		let newTeamId = 46;
		events.forEach((event) => {
			event.teams.forEach((team) => {
				const scheduledUsersInitial = [];
				team.roles.forEach((a, index) => {
					scheduledUsersInitial.push(index + 1);
				});
				// @ts-ignore
				event.eventTeams.push({
					id: newTeamId,
					team: team.id,
					at_capacity: false,
					scheduled_users: scheduledUsersInitial,
				});
				newTeamId++;
			});
		});
		console.log(events);
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
												<Typography variant={'h2'} color={'secondary'}>
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
												<Typography variant={'h2'} color={'secondary'}>
													32
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
												<Typography variant={'h2'} color={'secondary'}>
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
												<Typography variant={'h2'} color={'secondary'}>
													3
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
							setEvents={setEvents}
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
	db,
	userDragging,
	setUserDragging,
	updateEvent,
	setEvents,
	events,
}: {
	eventId: number;
	eventName: string;
	eventDate: string;
	db: DatabaseType;
	userDragging: null | User;
	setUserDragging: React.Dispatch<React.SetStateAction<User | null>>;
	setEvents: React.Dispatch<React.SetStateAction<MinistryEvent[]>>;
	events: MinistryEvent[];
}) {
	const [isExpanded, setIsExpanded] = useState(false);

	const event = db.getEvent(eventId);
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
								db={db}
								userDragging={userDragging}
								setUserDragging={setUserDragging}
								eventId={eventId}
								teamId={team.id}
								setEvents={setEvents}
								events={events}
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
	db,
	userDragging,
	setUserDragging,
	eventId,
	teamId,
	setEvents,
}: {
	teamName: string;
	roles: number[];
	db: DatabaseType;
	userDragging: null | User;
	setUserDragging: React.Dispatch<React.SetStateAction<User | null>>;
	eventId: number;
	teamId: number;
	setEvents: React.Dispatch<React.SetStateAction<MinistryEvent[]>>;
	events: MinistryEvent[];
}) {
	const fullRoles = roles.map((role: number) => db.getRole(role)) as Role[];
	const event = db.getEvent(eventId);
	const [usersInRoles, setUsersInRoles] = useState(
		Array.from(fullRoles, () => null)
	);

	return (
		<Grid item xs={12} md={4}>
			<Card variant="outlined">
				<CardContent>
					<Typography mb={2}>Team: {teamName}</Typography>
					<TableContainer component={Paper}>
						<Table size="small" aria-label="a dense table">
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
									const userName = `${userObj?.firstName} ${userObj?.lastName}`;
									return (
										<EventPosition
											key={role.id}
											position={role.type}
											userDragging={userDragging}
											setUserDragging={setUserDragging}
											roleIndex={index}
											usersName={
												usersInRoles[index] !== null
													? `${db.getUser(usersInRoles[index])?.firstName} ${
															db.getUser(usersInRoles[index])?.lastName
													  }`
													: ''
											}
											setUserToEvent={() => {
												const newUsersInRoles = [...usersInRoles];
												newUsersInRoles[index] = userDragging.id;
												setUsersInRoles(newUsersInRoles);
												// setEvents();
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
	const [filter, setFilter] = useState<any>('All Teams');
	const [filteredVolunteers, setFilteredVolunteers] = useState(volunteers);
	const [volunteerFilterInputValue, setVolunteerFilterInputValue] =
		useState('');
	useEffect(() => {
		setFilteredVolunteers(
			volunteers.filter((volunteer) => {
				return (
					volunteer.firstName
						.toLowerCase()
						.includes(volunteerFilterInputValue) ||
					volunteer.lastName
						.toLowerCase()
						.includes(volunteerFilterInputValue.toLowerCase())
				);
			})
		);
	}, [volunteerFilterInputValue]);
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
											onClick={() => {}}
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
										onChange={(e) => {
											console.log(e.target.value);
											setFilter(e.target.value);
										}}
									>
										<MenuItem value={'All Teams'}>All Teams</MenuItem>
										<MenuItem value={'Music Team'}>Music Team</MenuItem>
										<MenuItem value={'Tech Team'}>Tech Team</MenuItem>
									</Select>
								</FormControl>
								<Button
									color="error"
									onClick={() => {
										setFilter('All Teams');
									}}
									disabled={filter === 'All Teams'}
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
							<CardContent>
								<Box mb={2}>
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

								<Grid container rowSpacing={1} spacing={1}>
									{filteredVolunteers.map((user, i) => {
										return (
											<Grid
												draggable
												onDragStart={(e) => {
													setUserDragging(user);
												}}
												onDragEnd={(e) => {}}
												item
												key={`avatar ${i}`}
											>
												<Tooltip title={`${user.firstName} ${user.lastName}`}>
													<UserDialog user={user} />
												</Tooltip>
											</Grid>
										);
									})}
								</Grid>
							</CardContent>
						</Card>
					</Stack>
				</CardContent>
			</Card>
		</Grid>
	);
}
