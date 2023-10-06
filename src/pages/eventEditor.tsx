import Typography from '@mui/material/Typography';
import "./eventEditor.scss"
import { Card, CardContent, CardHeader, Grid, Paper, Table, TableContainer, TableHead,TableRow,TableCell,TableBody } from '@mui/material';
export default function EventEditor() {
	return (
			<Grid container rowSpacing={1} spacing={2}>
				<Grid item xs={8}>
					<Grid container rowSpacing={1} spacing={1}>
					<EventCard teamName={'Tech Team'} positions={[]}/>
					<EventCard teamName={'Tech Team'} positions={[]}/>
					<EventCard teamName={'Tech Team'} positions={[]}/>
					<EventCard teamName={'Tech Team'} positions={[]}/>
					<EventCard teamName={'Tech Team'} positions={[]}/>
					</Grid>
				</Grid>
				<Grid item xs={4}>
					<VolunteerCard volunteers={[]}/>
				</Grid>
			</Grid>
	)
}

function EventCard({teamName,positions}:{teamName: string; positions: string[];}) {
	// @ts-ignore
	return (
		<Grid item xs={4}>
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
								<EventPosition position={'Sound Engineer'} volunteer={'Daniel'}/>
								<EventPosition position={'Lighting Engineer'} volunteer={'Roger'}/>
								<EventPosition position={'Slides'} volunteer={'Patrick'}/>
								<EventPosition position={'Video Director'} volunteer={'Andrew'}/>
							</TableBody>
						</Table>
					</TableContainer>
				</CardContent>
			</Card>
		</Grid>
	)
}

function EventPosition({position, volunteer}:{position: string;volunteer:string}) {
	return (
		<TableRow
			key={position}
		>
			<TableCell component="th" scope="row">
				{position}
			</TableCell>
			<TableCell>{volunteer}</TableCell>
		</TableRow>)
}

function VolunteerCard({volunteers}:{ volunteers: string[];}) {
	// @ts-ignore
	return (
		<Grid item>
			<Card variant="outlined">
				<CardContent>
					<CardHeader title={'Volunteers'}></CardHeader>
					<Typography>volunteers will go here</Typography>
				</CardContent>
			</Card>
		</Grid>
	)
}
