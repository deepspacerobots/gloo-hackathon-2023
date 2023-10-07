import { Avatar } from '@mui/material';
import './UserProfile.scss';
import { RoleOptions } from '@/db/types';
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
	console.log(userId);
	const db = useDBContext();
	const user = db.getUser(userId);

	return (
		user && (
			<Card sx={{ minWidth: 275 }}>
				<CardContent>
					<Avatar alt="Remy Sharp" src={user.profilePhoto} />
					<Typography variant="h5" component="div">
						{user.firstName} {user.lastName}
					</Typography>
					<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
						{user.role}
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
