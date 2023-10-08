import { Avatar, Box, Chip, Stack } from '@mui/material';
import './UserProfile.scss';
import { Experience, RoleOptions, Team } from '@/db/types';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useDBContext } from '@/contexts/db.context';

interface Props {
	userId: number;
}

const UserProfile = (props: Props) => {
	const { userId } = props;

	const db = useDBContext();
	const user = db.getUser(userId);
	console.log(user);

	return (
		user && (
			<Card sx={{ minWidth: 275 }}>
				<CardContent className="user-profile-layout">
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
					<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
						Experiences:
					</Typography>
				</CardContent>
				<CardActions>
					<Button size="small">Learn More</Button>
				</CardActions>
			</Card>
		)
	);
};
export default UserProfile;
