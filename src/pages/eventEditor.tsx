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
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';

export default function EventEditor() {
	return (
		<Grid container spacing={2}>
			<Grid item xs={8}>
				<Grid container rowSpacing={1}>
					<EventCard eventName={'Sunday Morning Service 1'} />
					<EventCard eventName={'Sunday Morning Service 2'} />
				</Grid>
			</Grid>
			<Grid item xs={4}>
				<VolunteerCard volunteers={[]} />
			</Grid>
		</Grid>
	);
}

function EventCard({ eventName }: { eventName: string }) {
	const [isExpanded, setIsExpanded] = useState(false);
	return (
		<Grid item xs={12}>
			<Accordion
				expanded={isExpanded}
				onChange={() => {
					setIsExpanded(!isExpanded);
				}}
			>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Stack>
						<Typography>{eventName}</Typography>
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
									<TeamCardSecondary teamName={'Tech Team'} positions={[]} />
									<TeamCardSecondary teamName={'Tech Team'} positions={[]} />
									<TeamCardSecondary teamName={'Tech Team'} positions={[]} />
									<TeamCardSecondary teamName={'Tech Team'} positions={[]} />
									<TeamCardSecondary teamName={'Tech Team'} positions={[]} />
								</Grid>
							</AccordionDetails>
						</Accordion>
					</Stack>
				</AccordionSummary>
				<AccordionDetails>
					<Grid container rowSpacing={1} spacing={1}>
						<TeamCard teamName={'Tech Team'} positions={[]} />
						<TeamCard teamName={'Tech Team'} positions={[]} />
						<TeamCard teamName={'Tech Team'} positions={[]} />
						<TeamCard teamName={'Tech Team'} positions={[]} />
						<TeamCard teamName={'Tech Team'} positions={[]} />
					</Grid>
				</AccordionDetails>
			</Accordion>
		</Grid>
	);
}

function TeamCard({
										teamName,
										positions,
									}: {
	teamName: string;
	positions: string[];
}) {
	// @ts-ignore
	return (
		<Grid item xs={4}>
			<Card variant='outlined'>
				<CardContent>
					<Typography mb={2}>Team: {teamName}</Typography>
					<TableContainer component={Paper}>
						<Table size='small' aria-label='a dense table'>
							<TableHead>
								<TableRow>
									<TableCell>Position</TableCell>
									<TableCell>Volunteer</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<EventPosition
									position={'Sound Engineer'}
									volunteer={'Daniel'}
								/>
								<EventPosition
									position={'Lighting Engineer'}
									volunteer={'Roger'}
								/>
								<EventPosition position={'Slides'} volunteer={'Patrick'} />
								<EventPosition
									position={'Video Director'}
									volunteer={'Andrew'}
								/>
							</TableBody>
						</Table>
					</TableContainer>
				</CardContent>
			</Card>
		</Grid>
	);
}

function TeamCardSecondary({
														 teamName,
														 positions,
													 }: {
	teamName: string;
	positions: string[];
}) {
	// @ts-ignore
	return (
		<Grid item xs={4}>
			<Card variant='outlined'>
				<CardContent>
					<Typography mb={2}>Team: {teamName}</Typography>
				</CardContent>
			</Card>
		</Grid>
	);
}

function EventPosition({
												 position,
												 volunteer,
											 }: {
	position: string;
	volunteer: string;
}) {
	const [styles, setStyle] = useState('');
	return (
		<TableRow
			key={position}
			className={styles}
			onDragLeave={(e) => {
				e.preventDefault();
				setStyle('');
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
				console.log(position);
				setStyle('');
			}}
		>
			<TableCell component='th' scope='row'>
				{position}
			</TableCell>
			<TableCell>{volunteer}</TableCell>
		</TableRow>
	);
}

function VolunteerCard({ volunteers }: { volunteers: string[] }) {
	const [avatars, setAvatars] = useState<any[]>([]);
	useEffect(() => {
		const mArr = Array.from(
			{ length: 99 },
			(_, i) => `/public/img/profile-pics/man-${i + 1}.jpg`,
		);
		const wArr = Array.from(
			{ length: 99 },
			(_, i) => `/public/img/profile-pics/woman-${i + 1}.jpg`,
		);
		const avatarCollection = [];
		const avatarIcons = [];
		const shuffle = (array) => {
			return array
				.map((a) => ({ sort: Math.random(), value: a }))
				.sort((a, b) => a.sort - b.sort)
				.map((a) => a.value);
		};
		const shuffledArr = shuffle([...mArr, ...wArr]);
		for (let i = 0; i < 50; i++) {
			avatarIcons.push(<Avatar key={shuffledArr[i]} src={shuffledArr[i]} />);
		}
		setAvatars(avatarIcons);
	}, []);
	const handleDragStart = (e) => {
	};
	const handleDragEnd = (e) => {
	};
	const [filter, setFilter] = useState<any>('All Teams');
	return (
		<Grid item className={'volunteerCard'}>
			<Card variant='outlined'>
				<CardContent>
					{/*<CardHeader title={'Assign Volunteers'}></CardHeader>*/}
					<Stack spacing={1}>
						<Card>
							<CardHeader title={'Assistant'} subheader={'Let AI assign your volunteers'} />
							<CardContent>
								<Grid container spacing={1}>
									<Grid item>
										<Button variant='contained' color='success'>AI Assign</Button>
									</Grid>
									<Grid item>
										<Button color='error'>Unassign All</Button>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
						<Card>
							<CardHeader title={'Filter'} subheader={'See only who is part of a selected team'} />
							<CardContent>
								<FormControl fullWidth>
									<InputLabel>Team</InputLabel>
									<Select
										size='small'
										value={filter}
										label='Team'
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
								<Button color='error' onClick={() => {
									setFilter('All Teams');
								}}>Reset</Button>
							</CardContent>
						</Card>
						<Card>
							<CardHeader title={'Available Volunteers'}
													subheader={'Click and drag volunteers to manually assign them'} />
							<CardContent>
								<Grid container rowSpacing={1} spacing={1}>
									{avatars.map((avatar) => {
										return (
											<Grid draggable
														onDragStart={handleDragStart}
														onDragEnd={handleDragEnd} item>
												{avatar}
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
