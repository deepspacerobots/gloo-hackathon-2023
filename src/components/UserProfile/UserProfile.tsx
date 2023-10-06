import { Avatar } from '@mui/material';
import './UserProfile.scss';
import { RoleOptions } from '@/db/types';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const user = {
	id: 1,
	firstName: 'John',
	lastName: 'Doe',
	role: RoleOptions.Volunteer,
	address: '123 Main St',
	city: 'Anytown',
	state: 'CA',
	zip: '12345',
	email: 'john@example.com',
	password: 'password123',
	phone: '555-555-5555',
	profilePhoto: '/img/profile-pics/man-1.jpg',
	preferredNumWeeksServing: 3,
	experiences: [1, 2], // IDs of previous experiences
};

const UserProfile = () => {
	return (
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
	);
};
export default UserProfile;
