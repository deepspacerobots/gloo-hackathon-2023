import {
	Organization,
	MinistryEvent,
	Ministry,
	Team,
	Role,
	Requirement,
	User,
	Experience,
	Thread,
	Message,
	RoleOptions,
	TypeOptions,
} from './types';

type DBSchema = {
	organizations: Organization[];
	events: MinistryEvent[];
	ministries: Ministry[];
	teams: Team[];
	roles: Role[];
	requirements: Requirement[];
	users: User[];
	experiences: Experience[];
	threads?: Thread[];
	messages?: Message[];
};

class Database {
	organizations: Organization[];
	events: MinistryEvent[];
	ministries: Ministry[];
	teams: Team[];
	roles: Role[];
	requirements: Requirement[];
	users: User[];
	experiences: Experience[];

	constructor(preexistingData: DBSchema) {
		this.organizations = preexistingData.organizations;
		this.events = preexistingData.events;
		this.ministries = preexistingData.ministries;
		this.teams = preexistingData.teams;
		this.roles = preexistingData.roles;
		this.requirements = preexistingData.requirements;
		this.users = preexistingData.users;
		this.experiences = preexistingData.experiences;
	}

	getOrganization(organizationId: number): Organization | undefined {
		const organization = this.organizations.find(
			(organization: Organization) => organization.id === organizationId
		);

		if (organization) {
			organization.seniorPastor = this.users.find(
				(user: User) => organization.seniorPastor === user.id
			);
		}

		return organization;
	}

	setOrganization(payload: Organization): Organization {
		payload.id = this.organizations[this.organizations.length - 1].id + 1;
		this.organizations.push(payload);
		return payload;
	}

	getEvent(eventId: number): MinistryEvent | undefined {
		const event = this.events.find(
			(event: MinistryEvent) => event.id === eventId
		);

		if (event) {
			event.ministries = this.ministries.filter((ministry: Ministry) =>
				(event.ministries as number[]).includes(ministry.id)
			);

			event.teams = this.teams.filter((team: Team) =>
				(event.teams as number[]).includes(team.id)
			);
		}

		return event;
	}

	setEvent(payload: MinistryEvent): MinistryEvent {
		payload.id = this.events[this.events.length - 1].id + 1;
		this.events.push(payload);
		return payload;
	}

	getMinistry(ministryId: number): Ministry | undefined {
		const ministry = this.ministries.find(
			(ministry: Ministry) => ministry.id === ministryId
		);

		if (ministry) {
			ministry.teams = this.teams.filter((team: Team) =>
				(ministry.teams as number[]).includes(team.id)
			);
		}

		return ministry;
	}

	setMinistry(payload: Ministry): Ministry {
		payload.id = this.ministries[this.ministries.length - 1].id + 1;
		this.ministries.push(payload);
		return payload;
	}

	getTeam(teamId: number): Team | undefined {
		const team = this.teams.find((team: Team) => team.id === teamId);

		if (team) {
			team.roles = this.roles.filter((role: Role) =>
				(team.roles as number[]).includes(role.id)
			);

			team.teamLead = this.users.find(
				(user: User) => team.teamLead === user.id
			);
		}

		return team;
	}

	setTeam(payload: Team): Team {
		payload.id = this.teams[this.teams.length - 1].id + 1;
		this.teams.push(payload);
		return payload;
	}

	getRole(roleId: number): Role | undefined {
		const role = this.roles.find((role: Role) => role.id === roleId);

		if (role) {
			role.user = this.users.find((user: User) => role.user === user.id);
		}

		return role;
	}

	setRole(payload: Role): Role {
		payload.id = this.roles[this.roles.length - 1].id + 1;
		this.roles.push(payload);
		return payload;
	}

	getRequirement(requirementId: number): Requirement | undefined {
		const requirement = this.requirements.find(
			(requirement: Requirement) => requirement.id === requirementId
		);

		if (requirement) {
			requirement.event = this.events.find(
				(event: MinistryEvent) => requirement.event === event.id
			);
			requirement.ministry = this.ministries.find(
				(ministry: Ministry) => requirement.ministry === ministry.id
			);
		}

		return requirement;
	}

	setRequirement(payload: Requirement): Requirement {
		payload.id = this.requirements[this.requirements.length - 1].id + 1;
		this.requirements.push(payload);
		return payload;
	}

	getUser(userId: number): User | undefined {
		const user = this.users.find((user: User) => user.id === userId);

		if (user) {
			user.relatedVolunteer = this.users.find(
				(userIteration: User) => user.relatedVolunteer === userIteration.id
			);

			user.teams = this.teams.filter((team: Team) =>
				(user.teams as number[]).includes(team.id)
			);

			user.events = this.events.filter((event: MinistryEvent) =>
				(user.events as number[]).includes(event.id)
			);

			user.experiences = this.experiences.filter((experience: Experience) =>
				(user.experiences as number[]).includes(experience.id)
			);
		}

		return user;
	}

	setUser(payload: User): User {
		payload.id = this.users[this.users.length - 1].id + 1;
		this.users.push(payload);
		return payload;
	}

	getExperience(experienceId: number): Experience | undefined {
		const experience = this.experiences.find(
			(experience: Experience) => experience.id === experienceId
		);

		return experience;
	}

	setExperience(payload: Experience): Experience {
		payload.id = this.experiences[this.experiences.length - 1].id + 1;
		this.experiences.push(payload);
		return payload;
	}
}

const preexistingData: DBSchema = {
	organizations: [
		{
			id: 1,
			name: 'Community Church',
			description: 'A welcoming church serving the local community.',
			address: '123 Main Street, Anytown, USA',
			seniorPastor: 1,
			logo: '/img/organization_logo.jpg',
			website: 'https://www.communitychurch.org',
			brandColors: ['#3498db', '#e74c3c', '#2ecc71'],
		},
	],
	events: [
		{
			id: 1,
			title: 'Sunday Morning Worship Service',
			description: 'Join us every Sunday for a vibrant worship experience.',
			date: '2023-10-31',
			time: '11:00 AM',
			ministries: [1],
		},
	],
	ministries: [
		{
			id: 1,
			title: 'Worship Ministry',
			description: 'The worship team leads us in praise and worship to God',
			logo: '/img/worship-service-logo.jpg',
			bannerImage: '/img/worship-service-banner.jpg',
			teams: [1, 2],
		},
		{
			id: 2,
			title: 'Pastoral Care Ministry',
			description:
				'The pastoral care team helps campus pastors to care for the congregation',
			teams: [3],
		},
		{
			id: 3,
			title: 'Social Ministry',
			description:
				'The social team greets and interacts with congregants as they are entering/leaving the building',
			teams: [4],
		},
	],
	teams: [
		{
			id: 1,
			title: 'Worship Team',
			roles: [1, 2, 3],
			teamLead: 1,
		},
		{
			id: 2,
			title: 'Front of House',
			description:
				'FOH handles audio and lighting engineering, as well as managing slides',
			roles: [4, 5, 6],
			requirements: [1],
			teamLead: 2,
		},
		{
			id: 3,
			title: 'Pastoral Care Team',
			description:
				'The pastoral care team is responsible for helping the lead/associate pastors care for the congregation',
			roles: [7, 8],
			teamLead: 3,
		},
		{
			id: 4,
			title: 'Greeting / Egress',
			description:
				'The Greeting/Egress team is responsible for greeting congregants as they enter and leave worship services',
			roles: [9, 10],
			teamLead: 4,
		},
	],
	roles: [
		{
			id: 1,
			type: TypeOptions.BandVocalsLead,
			description: 'Lead vocalist',
			experienceRequired: 3,
		},
		{
			id: 2,
			type: TypeOptions.BandGuitarLead,
			description: 'Lead guitarist',
			experienceRequired: 3,
		},
		{
			id: 3,
			type: TypeOptions.BandKeys,
			experienceRequired: 3,
		},
		{
			id: 4,
			type: TypeOptions.TechAudio,
			description: 'Audio engineer',
			experienceRequired: 2,
		},
		{
			id: 5,
			type: TypeOptions.TechLighting,
			description: 'Lighting engineer',
			experienceRequired: 3,
		},
		{
			id: 6,
			type: TypeOptions.TechSlides,
			description: 'Controls slides throughout service for worship and sermon',
			experienceRequired: 2,
		},
		{
			id: 7,
			type: TypeOptions.PastoralCare,
			description:
				'Helps pastors care for the congregation during/around service times',
			experienceRequired: 2,
		},
		{
			id: 8,
			type: TypeOptions.Prayer,
			description:
				'Available for the congregation if they need prayer during/around service times',
			experienceRequired: 2,
		},
		{
			id: 9,
			type: TypeOptions.SocialGreeting,
			description: 'Greet congregants as they enter the building/sanctuary',
			experienceRequired: 1,
		},
		{
			id: 10,
			type: TypeOptions.SocialEgress,
			description:
				'Interact with congregants as they are leaving the building/sanctuary',
			experienceRequired: 1,
		},
	],
	requirements: [],
	users: [
		{
			id: 1,
			firstName: 'John',
			lastName: 'Doe',
			role: RoleOptions.TeamLead,
			address: '123 Main St',
			city: 'Anytown',
			state: 'CA',
			zip: '12345',
			email: 'john@example.com',
			password: 'password123',
			phone: '555-555-5555',
			profilePhoto: '/img/profile-pics/man-1.jpg',
			preferredNumWeeksServing: 3,
			experiences: [1, 2],
		},
		{
			id: 2,
			firstName: 'Alice',
			lastName: 'Smith',
			role: RoleOptions.TeamLead,
			address: '456 Elm St',
			city: 'Smallville',
			state: 'NY',
			zip: '54321',
			email: 'alice@example.com',
			password: 'password456',
			phone: '555-555-5556',
			profilePhoto: '/img/profile-pics/woman-1.jpg',
			preferredNumWeeksServing: 2,
			experiences: [3],
		},
		{
			id: 3,
			firstName: 'Michael',
			lastName: 'Johnson',
			role: RoleOptions.TeamLead,
			address: '789 Oak Ave',
			city: 'Hometown',
			state: 'TX',
			zip: '98765',
			email: 'michael@example.com',
			password: 'password789',
			phone: '555-555-5557',
			profilePhoto: '/img/profile-pics/man-2.jpg',
			preferredNumWeeksServing: 1,
		},
		{
			id: 4,
			firstName: 'Sarah',
			lastName: 'Brown',
			role: RoleOptions.TeamLead,
			email: 'sarah@example.com',
			password: 'password890',
			phone: '555-555-5558',
			preferredNumWeeksServing: 4,
			experiences: [4, 5, 6],
		},
		{
			id: 5,
			firstName: 'David',
			lastName: 'Wilson',
			role: RoleOptions.Volunteer,
			email: 'david@example.com',
			password: 'password901',
			profilePhoto: '/img/profile-pics/man-12.jpg',
			preferredNumWeeksServing: 2,
			experiences: [7, 8],
		},
		{
			id: 6,
			firstName: 'Emily',
			lastName: 'Davis',
			role: RoleOptions.Volunteer,
			email: 'emily@example.com',
			password: 'password234',
			phone: '555-555-5559',
			profilePhoto: '/img/profile-pics/woman-12.jpg',
			preferredNumWeeksServing: 3,
		},
		{
			id: 7,
			firstName: 'James',
			lastName: 'Clark',
			role: RoleOptions.Volunteer,
			email: 'james@example.com',
			password: 'password567',
			phone: '555-555-5560',
			preferredNumWeeksServing: 2,
			experiences: [9],
		},
		{
			id: 8,
			firstName: 'Olivia',
			lastName: 'Martinez',
			role: RoleOptions.Volunteer,
			email: 'olivia@example.com',
			password: 'password890',
			phone: '555-555-5561',
			profilePhoto: '/img/profile-pics/woman-13.jpg',
			preferredNumWeeksServing: 4,
			experiences: [10],
		},
		{
			id: 9,
			firstName: 'Liam',
			lastName: 'Lee',
			role: RoleOptions.Volunteer,
			email: 'liam@example.com',
			password: 'password123',
			profilePhoto: '/img/profile-pics/man-13.jpg',
			preferredNumWeeksServing: 1,
			experiences: [11],
		},
		{
			id: 10,
			firstName: 'Ava',
			lastName: 'Garcia',
			role: RoleOptions.Volunteer,
			email: 'ava@example.com',
			password: 'password456',
			phone: '555-555-5562',
			profilePhoto: '/img/profile-pics/woman-17.jpg',
			preferredNumWeeksServing: 2,
		},
		{
			id: 11,
			firstName: 'Robert',
			lastName: 'Turner',
			role: RoleOptions.Volunteer,
			email: 'robert@example.com',
			password: 'password789',
			profilePhoto: '/img/profile-pics/man-14.jpg',
			preferredNumWeeksServing: 3,
			experiences: [12, 13, 14],
		},
		{
			id: 12,
			firstName: 'Sophia',
			lastName: 'Hernandez',
			role: RoleOptions.Volunteer,
			email: 'sophia@example.com',
			password: 'password123',
			phone: '555-555-5563',
			profilePhoto: '/img/profile-pics/woman-21.jpg',
			preferredNumWeeksServing: 2,
			experiences: [15],
		},
		{
			id: 13,
			firstName: 'William',
			lastName: 'Scott',
			role: RoleOptions.Volunteer,
			email: 'william@example.com',
			password: 'password456',
			preferredNumWeeksServing: 1,
			experiences: [16],
		},
		{
			id: 14,
			firstName: 'Ella',
			lastName: 'Adams',
			role: RoleOptions.Volunteer,
			email: 'ella@example.com',
			password: 'password890',
			phone: '555-555-5564',
			profilePhoto: '/img/profile-pics/woman-23.jpg',
			preferredNumWeeksServing: 4,
			experiences: [17],
		},
		{
			id: 15,
			firstName: 'Michael',
			lastName: 'Baker',
			role: RoleOptions.Volunteer,
			email: 'michael@example.com',
			password: 'password901',
			preferredNumWeeksServing: 2,
			experiences: [18],
		},
		{
			id: 16,
			firstName: 'Grace',
			lastName: 'Lewis',
			role: RoleOptions.Volunteer,
			email: 'grace@example.com',
			password: 'password234',
			phone: '555-555-5565',
			profilePhoto: '/img/profile-pics/woman-22.jpg',
			preferredNumWeeksServing: 3,
		},
		{
			id: 17,
			firstName: 'Daniel',
			lastName: 'Green',
			role: RoleOptions.Volunteer,
			email: 'daniel@example.com',
			password: 'password567',
			profilePhoto: '/img/profile-pics/man-18.jpg',
			preferredNumWeeksServing: 2,
		},
		{
			id: 18,
			firstName: 'Mia',
			lastName: 'Lopez',
			role: RoleOptions.Volunteer,
			email: 'mia@example.com',
			password: 'password890',
			phone: '555-555-5566',
			profilePhoto: '/img/profile-pics/woman-8.jpg',
			preferredNumWeeksServing: 4,
		},
		{
			id: 19,
			firstName: 'Ethan',
			lastName: 'King',
			role: RoleOptions.Volunteer,
			email: 'ethan@example.com',
			password: 'password123',
			profilePhoto: '/img/profile-pics/man-16.jpg',
			preferredNumWeeksServing: 1,
			experiences: [19, 20, 21, 22],
		},
		{
			id: 20,
			firstName: 'Avery',
			lastName: 'Perez',
			role: RoleOptions.Volunteer,
			email: 'avery@example.com',
			password: 'password456',
			phone: '555-555-5567',
			profilePhoto: '/img/profile-pics/woman-25.jpg',
			preferredNumWeeksServing: 2,
			experiences: [23],
		},
		{
			id: 21,
			firstName: 'Noah',
			lastName: 'Hall',
			role: RoleOptions.Volunteer,
			email: 'noah@example.com',
			password: 'password123',
			preferredNumWeeksServing: 1,
			experiences: [24, 25],
		},
		{
			id: 22,
			firstName: 'Olivia',
			lastName: 'Wright',
			role: RoleOptions.Volunteer,
			email: 'olivia@example.com',
			password: 'password456',
			phone: '555-555-5568',
			profilePhoto: '/img/profile-pics/woman-26.jpg',
			preferredNumWeeksServing: 2,
		},
		{
			id: 23,
			firstName: 'Liam',
			lastName: 'Robinson',
			role: RoleOptions.Volunteer,
			email: 'liam@example.com',
			password: 'password789',
			preferredNumWeeksServing: 1,
			experiences: [26],
		},
		{
			id: 24,
			firstName: 'Emma',
			lastName: 'Diaz',
			role: RoleOptions.Volunteer,
			email: 'emma@example.com',
			password: 'password890',
			phone: '555-555-5569',
			preferredNumWeeksServing: 3,
			experiences: [27, 28],
		},
		{
			id: 25,
			firstName: 'Lucas',
			lastName: 'Scott',
			role: RoleOptions.Volunteer,
			email: 'lucas@example.com',
			password: 'password901',
			profilePhoto: '/img/profile-pics/man-21.jpg',
			preferredNumWeeksServing: 2,
			experiences: [29],
		},
		{
			id: 26,
			firstName: 'Ava',
			lastName: 'King',
			role: RoleOptions.Volunteer,
			email: 'ava@example.com',
			password: 'password234',
			phone: '555-555-5570',
			profilePhoto: '/img/profile-pics/woman-27.jpg',
			preferredNumWeeksServing: 4,
		},
		{
			id: 27,
			firstName: 'Mason',
			lastName: 'Young',
			role: RoleOptions.Volunteer,
			email: 'mason@example.com',
			password: 'password567',
			profilePhoto: '/img/profile-pics/man-22.jpg',
			preferredNumWeeksServing: 2,
			experiences: [30],
		},
		{
			id: 28,
			firstName: 'Sophia',
			lastName: 'Lopez',
			role: RoleOptions.Volunteer,
			email: 'sophia@example.com',
			password: 'password890',
			phone: '555-555-5571',
			preferredNumWeeksServing: 4,
			experiences: [31, 32],
		},
		{
			id: 29,
			firstName: 'Jackson',
			lastName: 'Garcia',
			role: RoleOptions.Volunteer,
			email: 'jackson@example.com',
			password: 'password123',
			preferredNumWeeksServing: 1,
			experiences: [33, 34, 35],
		},
		{
			id: 30,
			firstName: 'Lily',
			lastName: 'Clark',
			role: RoleOptions.Volunteer,
			email: 'lily@example.com',
			password: 'password456',
			phone: '555-555-5572',
			profilePhoto: '/img/profile-pics/woman-28.jpg',
			preferredNumWeeksServing: 2,
		},
		{
			id: 31,
			firstName: 'Elijah',
			lastName: 'Turner',
			role: RoleOptions.Volunteer,
			email: 'elijah@example.com',
			password: 'password123',
			profilePhoto: '/img/profile-pics/man-23.jpg',
			preferredNumWeeksServing: 1,
			experiences: [36, 37, 38],
		},
		{
			id: 32,
			firstName: 'Scarlett',
			lastName: 'Hernandez',
			role: RoleOptions.Volunteer,
			email: 'scarlett@example.com',
			password: 'password456',
			phone: '555-555-5573',
			preferredNumWeeksServing: 2,
			experiences: [39],
		},
		{
			id: 33,
			firstName: 'Benjamin',
			lastName: 'Scott',
			role: RoleOptions.Volunteer,
			email: 'benjamin@example.com',
			password: 'password789',
			profilePhoto: '/img/profile-pics/man-24.jpg',
			preferredNumWeeksServing: 1,
			experiences: [40],
		},
		{
			id: 34,
			firstName: 'Hannah',
			lastName: 'Perez',
			role: RoleOptions.Volunteer,
			email: 'hannah@example.com',
			password: 'password890',
			phone: '555-555-5574',
			preferredNumWeeksServing: 3,
			experiences: [41, 42, 43, 44],
		},
		{
			id: 35,
			firstName: 'Henry',
			lastName: 'Mitchell',
			role: RoleOptions.Volunteer,
			email: 'henry@example.com',
			password: 'password901',
			profilePhoto: '/img/profile-pics/man-25.jpg',
			preferredNumWeeksServing: 2,
			experiences: [45, 46],
		},
		{
			id: 36,
			firstName: 'Ella',
			lastName: 'Adams',
			role: RoleOptions.Volunteer,
			email: 'ella@example.com',
			password: 'password234',
			phone: '555-555-5575',
			profilePhoto: '/img/profile-pics/woman-31.jpg',
			preferredNumWeeksServing: 4,
			experiences: [47],
		},
		{
			id: 37,
			firstName: 'Samuel',
			lastName: 'Collins',
			role: RoleOptions.Volunteer,
			email: 'samuel@example.com',
			password: 'password567',
			preferredNumWeeksServing: 2,
		},
		{
			id: 38,
			firstName: 'Avery',
			lastName: 'Gonzalez',
			role: RoleOptions.Volunteer,
			email: 'avery@example.com',
			password: 'password890',
			phone: '555-555-5576',
			preferredNumWeeksServing: 4,
		},
		{
			id: 39,
			firstName: 'Daniel',
			lastName: 'Hall',
			role: RoleOptions.Volunteer,
			email: 'daniel@example.com',
			password: 'password123',
			profilePhoto: '/img/profile-pics/man-27.jpg',
			preferredNumWeeksServing: 1,
		},
		{
			id: 40,
			firstName: 'Sophie',
			lastName: 'Wright',
			role: RoleOptions.Volunteer,
			email: 'sophie@example.com',
			password: 'password456',
			phone: '555-555-5577',
			profilePhoto: '/img/profile-pics/woman-51.jpg',
			preferredNumWeeksServing: 2,
			experiences: [48, 49],
		},
		{
			id: 41,
			firstName: 'Mason',
			lastName: 'Brown',
			role: RoleOptions.Volunteer,
			email: 'mason@example.com',
			password: 'password123',
			profilePhoto: '/img/profile-pics/man-31.jpg',
			preferredNumWeeksServing: 1,
			experiences: [50],
		},
		{
			id: 42,
			firstName: 'Evelyn',
			lastName: 'Gomez',
			role: RoleOptions.Volunteer,
			email: 'evelyn@example.com',
			password: 'password456',
			phone: '555-555-5578',
			profilePhoto: '/img/profile-pics/woman-52.jpg',
			preferredNumWeeksServing: 2,
			experiences: [51, 52],
		},
		{
			id: 43,
			firstName: 'Liam',
			lastName: 'Reed',
			role: RoleOptions.Volunteer,
			email: 'liam@example.com',
			password: 'password789',
			preferredNumWeeksServing: 1,
			experiences: [53],
		},
		{
			id: 44,
			firstName: 'Ava',
			lastName: 'Rivera',
			role: RoleOptions.Volunteer,
			email: 'ava@example.com',
			password: 'password890',
			phone: '555-555-5579',
			profilePhoto: '/img/profile-pics/woman-53.jpg',
			preferredNumWeeksServing: 3,
			experiences: [54],
		},
		{
			id: 45,
			firstName: 'William',
			lastName: 'Ward',
			role: RoleOptions.Volunteer,
			email: 'william@example.com',
			password: 'password901',
			profilePhoto: '/img/profile-pics/man-32.jpg',
			preferredNumWeeksServing: 2,
			experiences: [55, 56],
		},
		{
			id: 46,
			firstName: 'Olivia',
			lastName: 'Morgan',
			role: RoleOptions.Volunteer,
			email: 'olivia@example.com',
			password: 'password234',
			phone: '555-555-5580',
			preferredNumWeeksServing: 4,
			experiences: [57, 58, 59],
		},
		{
			id: 47,
			firstName: 'James',
			lastName: 'Johnson',
			role: RoleOptions.Volunteer,
			email: 'james@example.com',
			password: 'password567',
			profilePhoto: '/img/profile-pics/man-33.jpg',
			preferredNumWeeksServing: 2,
		},
		{
			id: 48,
			firstName: 'Sophia',
			lastName: 'Parker',
			role: RoleOptions.Volunteer,
			email: 'sophia@example.com',
			password: 'password890',
			phone: '555-555-5581',
			profilePhoto: '/img/profile-pics/woman-55.jpg',
			preferredNumWeeksServing: 4,
			experiences: [60, 61],
		},
		{
			id: 49,
			firstName: 'Michael',
			lastName: 'Harris',
			role: RoleOptions.Volunteer,
			email: 'michael@example.com',
			password: 'password123',
			preferredNumWeeksServing: 1,
			experiences: [62],
		},
		{
			id: 50,
			firstName: 'Charlotte',
			lastName: 'Martin',
			role: RoleOptions.Volunteer,
			email: 'charlotte@example.com',
			password: 'password456',
			phone: '555-555-5582',
			preferredNumWeeksServing: 2,
			experiences: [63, 64, 65],
		},
		{
			id: 51,
			firstName: 'Liam',
			lastName: 'Perez',
			role: RoleOptions.Volunteer,
			email: 'liam@example.com',
			password: 'password123',
			profilePhoto: '/img/profile-pics/man-34.jpg',
			preferredNumWeeksServing: 1,
		},
		{
			id: 52,
			firstName: 'Olivia',
			lastName: 'Garcia',
			role: RoleOptions.Volunteer,
			email: 'olivia@example.com',
			password: 'password456',
			phone: '555-555-5583',
			profilePhoto: '/img/profile-pics/woman-56.jpg',
			preferredNumWeeksServing: 2,
			experiences: [66],
		},
		{
			id: 53,
			firstName: 'Ethan',
			lastName: 'Mitchell',
			role: RoleOptions.Volunteer,
			email: 'ethan@example.com',
			password: 'password789',
			profilePhoto: '/img/profile-pics/man-35.jpg',
			preferredNumWeeksServing: 1,
			experiences: [67, 68, 69],
		},
		{
			id: 54,
			firstName: 'Chloe',
			lastName: 'Turner',
			role: RoleOptions.Volunteer,
			email: 'chloe@example.com',
			password: 'password890',
			phone: '555-555-5584',
			profilePhoto: '/img/profile-pics/woman-62.jpg',
			preferredNumWeeksServing: 3,
			experiences: [70, 71],
		},
		{
			id: 55,
			firstName: 'Daniel',
			lastName: 'Hall',
			role: RoleOptions.Volunteer,
			email: 'daniel@example.com',
			password: 'password901',
			preferredNumWeeksServing: 2,
			experiences: [72],
		},
		{
			id: 56,
			firstName: 'Sophia',
			lastName: 'Hernandez',
			role: RoleOptions.Volunteer,
			email: 'sophia@example.com',
			password: 'password234',
			phone: '555-555-5585',
			preferredNumWeeksServing: 4,
			experiences: [73],
		},
		{
			id: 57,
			firstName: 'Jackson',
			lastName: 'Ward',
			role: RoleOptions.Volunteer,
			email: 'jackson@example.com',
			password: 'password567',
			profilePhoto: '/img/profile-pics/man-36.jpg',
			preferredNumWeeksServing: 2,
			experiences: [74],
		},
		{
			id: 58,
			firstName: 'Ava',
			lastName: 'Morgan',
			role: RoleOptions.Volunteer,
			email: 'ava@example.com',
			password: 'password890',
			phone: '555-555-5586',
			profilePhoto: '/img/profile-pics/woman-88.jpg',
			preferredNumWeeksServing: 4,
		},
		{
			id: 59,
			firstName: 'William',
			lastName: 'Johnson',
			role: RoleOptions.Volunteer,
			email: 'william@example.com',
			password: 'password123',
			profilePhoto: '/img/profile-pics/man-37.jpg',
			preferredNumWeeksServing: 1,
			experiences: [75, 76, 77, 78, 79],
		},
		{
			id: 60,
			firstName: 'Emma',
			lastName: 'Parker',
			role: RoleOptions.Volunteer,
			email: 'emma@example.com',
			password: 'password456',
			phone: '555-555-5587',
			profilePhoto: '/img/profile-pics/woman-97.jpg',
			preferredNumWeeksServing: 2,
			experiences: [80],
		},
	],
	experiences: [],
};

const DB = new Database(preexistingData);

export default DB;
