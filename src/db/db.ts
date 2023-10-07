import {
	EventTeam,
	Experience,
	LevelOptions,
	Message,
	Ministry,
	MinistryEvent,
	Organization,
	PreferenceOptions,
	Requirement,
	Role,
	RoleOptions,
	Team,
	Thread,
	TypeOptions,
	User,
} from './types';

type DBSchema = {
	organizations: Organization[];
	events: MinistryEvent[];
	ministries: Ministry[];
	teams: Team[];
	eventTeams: EventTeam[];
	roles: Role[];
	requirements: Requirement[];
	users: User[];
	experiences: Experience[];
	threads?: Thread[];
	messages?: Message[];
};

export class Database {
	organizations: Organization[];
	events: MinistryEvent[];
	eventTeams: EventTeam[];
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
		this.eventTeams = preexistingData.eventTeams;
		this.roles = preexistingData.roles;
		this.requirements = preexistingData.requirements;
		this.users = preexistingData.users;
		this.experiences = preexistingData.experiences;
	}

	getOrganization(organizationId: number): Organization | undefined {
		const organization = this.organizations.find(
			(organization: Organization) => organization.id === organizationId
		);

		if (typeof organization?.seniorPastor == 'number') {
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
			if (event.ministries?.length && typeof event.ministries[0] === 'number') {
				event.ministries = this.ministries.filter((ministry: Ministry) =>
					(event.ministries as number[]).includes(ministry.id)
				);
			}

			if (event.teams?.length && typeof event.teams[0] === 'number') {
				event.teams = this.teams.filter((team: Team) =>
					(event.teams as number[]).includes(team.id)
				);
			}

			if (event.eventTeams?.length && typeof event.eventTeams[0] === 'number') {
				event.eventTeams = this.eventTeams.filter((eventTeam: EventTeam) =>
					(event.eventTeams as number[]).includes(eventTeam.id)
				);
			}
		}

		return event;
	}

	getPastEvents(): MinistryEvent[] {
		const events = this.events;
		const now = new Date();

		return events.filter((event: MinistryEvent) => {
			const eventDate = new Date(event.date);
			return now > eventDate;
		});
	}

	getFutureEvents(): MinistryEvent[] {
		const events = this.events;
		const now = new Date();

		return events.filter((event: MinistryEvent) => {
			const eventDate = new Date(event.date);
			return now < eventDate;
		});
	}

	setEvent(payload: MinistryEvent): MinistryEvent {
		payload.id = this.events[this.events.length - 1].id + 1;
		this.events.push(payload);
		return payload;
	}

	getEventTeam(eventTeamId: number): EventTeam | undefined {
		const eventTeam = this.eventTeams.find(
			(eventTeam) => eventTeam.id === eventTeamId
		);

		return eventTeam;
	}

	getMinistry(ministryId: number): Ministry | undefined {
		const ministry = this.ministries.find(
			(ministry: Ministry) => ministry.id === ministryId
		);

		if (ministry?.teams?.length && typeof ministry.teams[0] === 'number') {
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
			if (team.roles?.length && typeof team.roles[0] === 'number') {
				team.roles = this.roles.filter((role: Role) =>
					(team.roles as number[]).includes(role.id)
				);
			}

			if (typeof team?.teamLead === 'number') {
				team.teamLead = this.users.find(
					(user: User) => team.teamLead === user.id
				);
			}

			if (team.users.length) {
				team.users = this.users.filter((user: User) =>
					(team.users as number[]).includes(user.id)
				);
			}
		}

		return team;
	}

	getAllTeams(): Team[] {
		return this.teams;
	}

	setTeam(payload: Team): Team {
		payload.id = this.teams[this.teams.length - 1].id + 1;
		this.teams.push(payload);
		return payload;
	}

	getRole(roleId: number): Role | undefined {
		const role = this.roles.find((role: Role) => role.id === roleId);

		if (typeof role?.user === 'number') {
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
			if (typeof requirement?.event === 'number') {
				requirement.event = this.events.find(
					(event: MinistryEvent) => requirement.event === event.id
				);
			}

			if (typeof requirement?.ministry === 'number') {
				requirement.ministry = this.ministries.find(
					(ministry: Ministry) => requirement.ministry === ministry.id
				);
			}
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
			if (typeof user?.relatedVolunteer === 'number') {
				user.relatedVolunteer = this.users.find(
					(userIteration: User) => user.relatedVolunteer === userIteration.id
				);
			}

			if (user.teams?.length && typeof user.teams[0] === 'number') {
				user.teams = this.teams.filter((team: Team) =>
					(user.teams as number[]).includes(team.id)
				);
			}

			if (user.events?.length && typeof user.events[0] === 'number') {
				user.events = this.events.filter((event: MinistryEvent) =>
					(user.events as number[]).includes(event.id)
				);
			}

			if (user.experiences?.length && typeof user.experiences[0] === 'number') {
				user.experiences = this.experiences.filter((experience: Experience) =>
					(user.experiences as number[]).includes(experience.id)
				);
			}
		}

		return user;
	}

	getUsers(): User[] {
		return this.users;
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

export const preexistingData: DBSchema = {
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
			date: '2023-09-10',
			time: '11:00 AM',
			ministries: [1, 2],
			teams: [1, 2, 3],
			eventTeams: [34, 35, 36],
		},
		{
			id: 2,
			title: 'Sunday Morning Worship Service',
			description: 'Join us every Sunday for a vibrant worship experience.',
			date: '2023-09-17',
			time: '11:00 AM',
			ministries: [1, 2],
			teams: [1, 2, 3],
			eventTeams: [37, 38, 39],
		},
		{
			id: 3,
			title: 'Sunday Morning Worship Service',
			description: 'Join us every Sunday for a vibrant worship experience.',
			date: '2023-09-24',
			time: '11:00 AM',
			ministries: [1, 2],
			teams: [1, 2, 3],
			eventTeams: [40, 41, 42],
		},
		{
			id: 4,
			title: 'Sunday Morning Worship Service',
			description: 'Join us every Sunday for a vibrant worship experience.',
			date: '2023-10-01',
			time: '11:00 AM',
			ministries: [1, 2],
			teams: [1, 2, 3],
			eventTeams: [43, 44, 45],
		},
		{
			id: 5,
			title: 'Sunday Morning Worship Service',
			description: 'Join us every Sunday for a vibrant worship experience.',
			date: '2023-10-08',
			time: '11:00 AM',
			ministries: [1, 2],
			teams: [1, 2, 3],
			eventTeams: [],
		},
		{
			id: 6,
			title: 'Sunday Morning Worship Service',
			description: 'Join us every Sunday for a vibrant worship experience.',
			date: '2023-10-15',
			time: '11:00 AM',
			ministries: [1, 2],
			teams: [1, 2, 3],
			eventTeams: [],
		},
		{
			id: 7,
			title: 'Sunday Morning Worship Service',
			description: 'Join us every Sunday for a vibrant worship experience.',
			date: '2023-10-22',
			time: '11:00 AM',
			ministries: [1, 2],
			teams: [1, 2, 3],
			eventTeams: [],
		},
	],
	ministries: [
		{
			id: 1,
			title: 'Worship Ministry',
			description:
				'The worship ministry encompasses all roles required to lead us in praise and worship to God',
			logo: '/img/worship-service-logo.jpg',
			bannerImage: '/img/worship-service-banner.jpg',
			teams: [1, 2],
		},
		{
			id: 2,
			title: 'Pastoral Care Ministry',
			description:
				'The pastoral care ministry helps campus pastors to care for the congregation',
			teams: [3],
		},
	],
	teams: [
		{
			id: 1,
			title: 'Worship Team',
			description: 'The worship team leads us in praise and worship to God',
			roles: [1, 2, 3, 4, 5, 6, 7],
			roles_required: [1, 1, 1, 1, 2, 3, 4, 5, 6, 7],
			users: [
				1, 2, 3, 9, 11, 16, 17, 18, 20, 24, 28, 29, 35, 36, 40, 41, 42, 48, 53,
				54, 60,
			],
			requirements: [],
			teamLead: 54,
		},
		{
			id: 2,
			title: 'Tech Team',
			description:
				'The tech team handles audio and lighting engineering, as well as managing slides',
			roles: [8, 9, 10, 11, 12, 13],
			roles_required: [8, 9, 9, 10, 11, 12, 13],
			users: [
				4, 5, 7, 8, 12, 13, 14, 15, 19, 21, 25, 27, 31, 32, 33, 34, 43, 44, 46,
				49, 50, 52, 55, 56, 57, 59,
			],
			requirements: [1],
			teamLead: 59,
		},
		{
			id: 3,
			title: 'Pastoral Care Team',
			description:
				'The pastoral care team is responsible for helping the lead/associate pastors care for the congregation',
			roles: [14, 15],
			roles_required: [14, 14, 14, 15, 15],
			users: [6, 10, 22, 23, 26, 30, 37, 38, 39, 45],
			requirements: [],
			teamLead: 58,
		},
	],
	eventTeams: [
		{
			id: 34,
			team: 1,
			at_capacity: true,
			scheduled_users: [1, 9, 20, 24, 35, 41, 53, 60],
		},
		{
			id: 35,
			team: 2,
			at_capacity: true,
			scheduled_users: [4, 5, 7, 8, 12, 13, 14],
		},
		{
			id: 36,
			team: 3,
			at_capacity: true,
			scheduled_users: [6, 10, 22, 23],
		},
		{
			id: 37,
			team: 1,
			at_capacity: true,
			scheduled_users: [2, 11, 28, 35, 40, 48, 53, 60],
		},
		{
			id: 38,
			team: 2,
			at_capacity: true,
			scheduled_users: [15, 19, 21, 25, 27, 31, 32],
		},
		{
			id: 39,
			team: 3,
			at_capacity: true,
			scheduled_users: [26, 30, 37, 38],
		},
		{
			id: 40,
			team: 1,
			at_capacity: true,
			scheduled_users: [16, 17, 18, 36, 40, 41, 48, 54],
		},
		{
			id: 41,
			team: 2,
			at_capacity: true,
			scheduled_users: [33, 34, 43, 44, 46, 49, 50],
		},
		{
			id: 42,
			team: 3,
			at_capacity: true,
			scheduled_users: [39, 45, 6, 10],
		},
		{
			id: 43,
			team: 1,
			at_capacity: true,
			scheduled_users: [1, 2, 9, 11, 20, 24, 29, 35],
		},
		{
			id: 44,
			team: 2,
			at_capacity: true,
			scheduled_users: [52, 55, 56, 57, 59, 4, 5],
		},
		{
			id: 45,
			team: 3,
			at_capacity: true,
			scheduled_users: [22, 23, 26, 30],
		},
	],
	roles: [
		{
			id: 1,
			type: TypeOptions.BandVocals,
			description: 'Lead vocalist',
			experienceRequired: 3,
		},
		{
			id: 2,
			type: TypeOptions.BandKeys,
			experienceRequired: 3,
		},
		{
			id: 3,
			type: TypeOptions.BandBass,
			experienceRequired: 3,
		},
		{
			id: 4,
			type: TypeOptions.BandElectricGuitar,
			description: 'Lead guitarist',
			experienceRequired: 3,
		},
		{
			id: 5,
			type: TypeOptions.BandAcousticGuitar,
			experienceRequired: 3,
		},
		{
			id: 6,
			type: TypeOptions.BandDrums,
			experienceRequired: 3,
		},
		{
			id: 7,
			type: TypeOptions.BandAux,
			experienceRequired: 3,
		},
		{
			id: 8,
			type: TypeOptions.TechGeneral,
			experienceRequired: 2,
		},
		{
			id: 9,
			type: TypeOptions.TechCameras,
			description: 'Audio engineer',
			experienceRequired: 2,
		},
		{
			id: 10,
			type: TypeOptions.TechLighting,
			description: 'Lighting engineer',
			experienceRequired: 3,
		},
		{
			id: 11,
			type: TypeOptions.TechAudio,
			description: 'Audio engineer',
			experienceRequired: 2,
		},
		{
			id: 12,
			type: TypeOptions.TechSlides,
			description: 'Controls slides throughout service for worship and sermon',
			experienceRequired: 2,
		},
		{
			id: 13,
			type: TypeOptions.TechVideoDirector,
			description: 'Controls slides throughout service for worship and sermon',
			experienceRequired: 2,
		},
		{
			id: 14,
			type: TypeOptions.Prayer,
			description:
				'Available for the congregation if they need prayer during/around service times',
			experienceRequired: 2,
		},
		{
			id: 15,
			type: TypeOptions.PastoralCare,
			description:
				'Helps pastors care for the congregation during/around service times',
			experienceRequired: 3,
		},
	],
	requirements: [
		{
			id: 1,
			title: 'Rehearsal Attendance',
			description: 'Attend Thursday night rehearsal',
			event: 1,
			ministry: 1,
		},
	],
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
			teams: [1],
			proficiencies: [
				{
					type: TypeOptions.BandVocals,
					experience: LevelOptions.Intermediate,
					preference: PreferenceOptions.High,
				},
				{
					type: TypeOptions.BandKeys,
					experience: LevelOptions.Advanced,
					preference: PreferenceOptions.VeryHigh,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [1],
			proficiencies: [
				{
					type: TypeOptions.BandBass,
					experience: LevelOptions.Beginner,
					preference: PreferenceOptions.Low,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [1],
			proficiencies: [
				{
					type: TypeOptions.BandVocals,
					experience: LevelOptions.Intermediate,
					preference: PreferenceOptions.High,
				},
				{
					type: TypeOptions.BandKeys,
					experience: LevelOptions.Advanced,
					preference: PreferenceOptions.VeryHigh,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [3],
			proficiencies: [
				{
					type: TypeOptions.Prayer,
					experience: LevelOptions.Beginner,
					preference: PreferenceOptions.Low,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [3],
			proficiencies: [
				{
					type: TypeOptions.PastoralCare,
					experience: LevelOptions.Intermediate,
					preference: PreferenceOptions.High,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [3],
			proficiencies: [
				{
					type: TypeOptions.PastoralCare,
					experience: LevelOptions.Intermediate,
					preference: PreferenceOptions.High,
				},
				{
					type: TypeOptions.Prayer,
					experience: LevelOptions.Advanced,
					preference: PreferenceOptions.VeryHigh,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [2],
			proficiencies: [
				{
					type: TypeOptions.TechLighting,
					experience: LevelOptions.Intermediate,
					preference: PreferenceOptions.High,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [2],
			proficiencies: [
				{
					type: TypeOptions.TechSlides,
					experience: LevelOptions.Beginner,
					preference: PreferenceOptions.Low,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [1],
			proficiencies: [
				{
					type: TypeOptions.BandElectricGuitar,
					experience: LevelOptions.Intermediate,
					preference: PreferenceOptions.High,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [3],
			proficiencies: [
				{
					type: TypeOptions.PastoralCare,
					experience: LevelOptions.Intermediate,
					preference: PreferenceOptions.High,
				},
				{
					type: TypeOptions.Prayer,
					experience: LevelOptions.Advanced,
					preference: PreferenceOptions.VeryHigh,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [1],
			proficiencies: [
				{
					type: TypeOptions.BandAcousticGuitar,
					experience: LevelOptions.Advanced,
					preference: PreferenceOptions.VeryHigh,
				},
				{
					type: TypeOptions.BandDrums,
					experience: LevelOptions.Beginner,
					preference: PreferenceOptions.Low,
				},
				{
					type: TypeOptions.BandAux,
					experience: LevelOptions.Intermediate,
					preference: PreferenceOptions.High,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [2],
			proficiencies: [
				{
					type: TypeOptions.TechVideoDirector,
					experience: LevelOptions.Advanced,
					preference: PreferenceOptions.VeryHigh,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
		},
		{
			id: 13,
			firstName: 'William',
			lastName: 'Scott',
			role: RoleOptions.Volunteer,
			email: 'william@example.com',
			password: 'password456',
			preferredNumWeeksServing: 1,
			teams: [2],
			proficiencies: [
				{
					type: TypeOptions.TechAudio,
					experience: LevelOptions.Intermediate,
					preference: PreferenceOptions.High,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [2],
			proficiencies: [
				{
					type: TypeOptions.TechLighting,
					experience: LevelOptions.Advanced,
					preference: PreferenceOptions.VeryHigh,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
		},
		{
			id: 15,
			firstName: 'Michael',
			lastName: 'Baker',
			role: RoleOptions.Volunteer,
			email: 'michael@example.com',
			password: 'password901',
			preferredNumWeeksServing: 2,
			teams: [2],
			proficiencies: [
				{
					type: TypeOptions.TechSlides,
					experience: LevelOptions.Beginner,
					preference: PreferenceOptions.Low,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [1],
			proficiencies: [
				{
					type: TypeOptions.BandKeys,
					experience: LevelOptions.Advanced,
					preference: PreferenceOptions.VeryHigh,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [1],
			proficiencies: [
				{
					type: TypeOptions.BandVocals,
					experience: LevelOptions.Intermediate,
					preference: PreferenceOptions.High,
				},
				{
					type: TypeOptions.BandAcousticGuitar,
					experience: LevelOptions.Intermediate,
					preference: PreferenceOptions.High,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [1],
			proficiencies: [
				{
					type: TypeOptions.BandVocals,
					experience: LevelOptions.Intermediate,
					preference: PreferenceOptions.High,
				},
				{
					type: TypeOptions.BandKeys,
					experience: LevelOptions.Intermediate,
					preference: PreferenceOptions.High,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [3],
			proficiencies: [
				{
					type: TypeOptions.Prayer,
					experience: LevelOptions.Intermediate,
					preference: PreferenceOptions.High,
				},
				{
					type: TypeOptions.PastoralCare,
					experience: LevelOptions.Advanced,
					preference: PreferenceOptions.VeryHigh,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [1],
			proficiencies: [
				{
					type: TypeOptions.BandDrums,
					experience: LevelOptions.Advanced,
					preference: PreferenceOptions.VeryHigh,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
		},
		{
			id: 21,
			firstName: 'Noah',
			lastName: 'Hall',
			role: RoleOptions.Volunteer,
			email: 'noah@example.com',
			password: 'password123',
			preferredNumWeeksServing: 1,
			teams: [3],
			proficiencies: [
				{
					type: TypeOptions.PastoralCare,
					experience: LevelOptions.Intermediate,
					preference: PreferenceOptions.High,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [3],
			proficiencies: [
				{
					type: TypeOptions.PastoralCare,
					experience: LevelOptions.Intermediate,
					preference: PreferenceOptions.High,
				},
				{
					type: TypeOptions.Prayer,
					experience: LevelOptions.Advanced,
					preference: PreferenceOptions.VeryHigh,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
		},
		{
			id: 23,
			firstName: 'Liam',
			lastName: 'Robinson',
			role: RoleOptions.Volunteer,
			email: 'liam@example.com',
			password: 'password789',
			preferredNumWeeksServing: 1,
			teams: [3],
			proficiencies: [
				{
					type: TypeOptions.Prayer,
					experience: LevelOptions.Advanced,
					preference: PreferenceOptions.VeryHigh,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [1],
			proficiencies: [
				{
					type: TypeOptions.BandAux,
					experience: LevelOptions.Intermediate,
					preference: PreferenceOptions.High,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [2],
			proficiencies: [
				{
					type: TypeOptions.TechCameras,
					experience: LevelOptions.Intermediate,
					preference: PreferenceOptions.High,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [3],
			proficiencies: [
				{
					type: TypeOptions.PastoralCare,
					experience: LevelOptions.Intermediate,
					preference: PreferenceOptions.High,
				},
				{
					type: TypeOptions.Prayer,
					experience: LevelOptions.Advanced,
					preference: PreferenceOptions.VeryHigh,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [2],
			proficiencies: [
				{
					type: TypeOptions.TechLighting,
					experience: LevelOptions.Advanced,
					preference: PreferenceOptions.VeryHigh,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [1],
			proficiencies: [
				{
					type: TypeOptions.BandElectricGuitar,
					experience: LevelOptions.Advanced,
					preference: PreferenceOptions.VeryHigh,
				},
				{
					type: TypeOptions.BandAcousticGuitar,
					experience: LevelOptions.Beginner,
					preference: PreferenceOptions.Low,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
		},
		{
			id: 29,
			firstName: 'Jackson',
			lastName: 'Garcia',
			role: RoleOptions.Volunteer,
			email: 'jackson@example.com',
			password: 'password123',
			preferredNumWeeksServing: 1,
			teams: [2],
			proficiencies: [
				{
					type: TypeOptions.TechVideoDirector,
					experience: LevelOptions.Advanced,
					preference: PreferenceOptions.VeryHigh,
				},
				{
					type: TypeOptions.TechAudio,
					experience: LevelOptions.Beginner,
					preference: PreferenceOptions.Low,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [3],
			proficiencies: [
				{
					type: TypeOptions.PastoralCare,
					experience: LevelOptions.Intermediate,
					preference: PreferenceOptions.High,
				},
				{
					type: TypeOptions.Prayer,
					experience: LevelOptions.Advanced,
					preference: PreferenceOptions.VeryHigh,
				},
			],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [2, 3],
			experiences: [36, 37, 38],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [2],
			experiences: [39],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [2],
			experiences: [40],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [2],
			experiences: [41, 42, 43, 44],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [1],
			experiences: [45, 46],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [1],
			experiences: [47],
			events: [],
			messages: [],
			blackoutDates: [],
		},
		{
			id: 37,
			firstName: 'Samuel',
			lastName: 'Collins',
			role: RoleOptions.Volunteer,
			email: 'samuel@example.com',
			password: 'password567',
			preferredNumWeeksServing: 2,
			teams: [3],
			experiences: [25, 26],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [3],
			experiences: [25, 26],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [3],
			experiences: [25, 26],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [1],
			experiences: [48, 49],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [1],
			experiences: [50],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [1, 2],
			experiences: [51, 52],
			events: [],
			messages: [],
			blackoutDates: [],
		},
		{
			id: 43,
			firstName: 'Liam',
			lastName: 'Reed',
			role: RoleOptions.Volunteer,
			email: 'liam@example.com',
			password: 'password789',
			preferredNumWeeksServing: 1,
			teams: [2],
			experiences: [53],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [2],
			experiences: [54],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [3],
			experiences: [55, 56],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [2],
			experiences: [57, 58, 59],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [],
			experiences: [],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [1],
			experiences: [60, 61],
			events: [],
			messages: [],
			blackoutDates: [],
		},
		{
			id: 49,
			firstName: 'Michael',
			lastName: 'Harris',
			role: RoleOptions.Volunteer,
			email: 'michael@example.com',
			password: 'password123',
			preferredNumWeeksServing: 1,
			teams: [2],
			experiences: [62],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [2, 3],
			experiences: [63, 64, 65],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [],
			experiences: [],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [2],
			experiences: [66],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [1, 2],
			experiences: [67, 68, 69],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [1],
			experiences: [70, 71],
			events: [],
			messages: [],
			blackoutDates: [],
		},
		{
			id: 55,
			firstName: 'Daniel',
			lastName: 'Hall',
			role: RoleOptions.Volunteer,
			email: 'daniel@example.com',
			password: 'password901',
			preferredNumWeeksServing: 2,
			teams: [2],
			experiences: [72],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [2],
			experiences: [73],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [2],
			experiences: [74],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [3],
			experiences: [76],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [2, 3],
			experiences: [75, 76, 77, 78, 79],
			events: [],
			messages: [],
			blackoutDates: [],
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
			teams: [1],
			experiences: [80],
			events: [],
			messages: [],
			blackoutDates: [],
		},
	],
	experiences: [
		{
			id: 36,
			type: TypeOptions.Prayer,
			level: LevelOptions.Intermediate,
			preference: PreferenceOptions.High,
			details: 'Prayer leader for church gatherings.',
		},
		{
			id: 37,
			type: TypeOptions.PastoralCare,
			level: LevelOptions.Advanced,
			preference: PreferenceOptions.VeryHigh,
			details: 'Provide specialized pastoral care to church members in need.',
		},
		{
			id: 38,
			type: TypeOptions.TechSlides,
			level: LevelOptions.Intermediate,
			preference: PreferenceOptions.High,
			details: 'Operate slide presentations during church services.',
		},
		{
			id: 39,
			type: TypeOptions.TechLighting,
			level: LevelOptions.Beginner,
			preference: PreferenceOptions.Low,
			details: 'Lighting technician for church events.',
		},
		{
			id: 40,
			type: TypeOptions.TechGeneral,
			level: LevelOptions.Intermediate,
			preference: PreferenceOptions.High,
			details: 'General technical support for church functions.',
		},
		{
			id: 41,
			type: TypeOptions.TechCameras,
			level: LevelOptions.Intermediate,
			preference: PreferenceOptions.High,
			details: 'Camera operator for church video productions.',
		},
		{
			id: 42,
			type: TypeOptions.TechSlides,
			level: LevelOptions.Beginner,
			preference: PreferenceOptions.Low,
			details: 'Manage slide presentations during church events.',
		},
		{
			id: 43,
			type: TypeOptions.TechLighting,
			level: LevelOptions.Advanced,
			preference: PreferenceOptions.VeryHigh,
			details: 'Advanced lighting design for church stage.',
		},
		{
			id: 44,
			type: TypeOptions.TechGeneral,
			level: LevelOptions.Intermediate,
			preference: PreferenceOptions.High,
			details: 'Provide general tech support for church functions.',
		},
		{
			id: 45,
			type: TypeOptions.BandVocals,
			level: LevelOptions.Advanced,
			preference: PreferenceOptions.VeryHigh,
			details: 'Lead vocalist for church worship team.',
		},
		{
			id: 47,
			type: TypeOptions.BandBass,
			level: LevelOptions.Beginner,
			preference: PreferenceOptions.Low,
			details: 'Bassist for church worship band.',
		},
		{
			id: 48,
			type: TypeOptions.BandElectricGuitar,
			level: LevelOptions.Advanced,
			preference: PreferenceOptions.VeryHigh,
			details: 'Lead electric guitarist for church band.',
		},
		{
			id: 49,
			type: TypeOptions.BandAcousticGuitar,
			level: LevelOptions.Beginner,
			preference: PreferenceOptions.Low,
			details: 'Acoustic guitarist for church worship.',
		},
		{
			id: 50,
			type: TypeOptions.BandDrums,
			level: LevelOptions.Intermediate,
			preference: PreferenceOptions.High,
			details: 'Intermediate drummer for church worship team.',
		},
		{
			id: 51,
			type: TypeOptions.BandAux,
			level: LevelOptions.Intermediate,
			preference: PreferenceOptions.High,
			details: 'Auxiliary musician for church worship band.',
		},
		{
			id: 52,
			type: TypeOptions.TechAudio,
			level: LevelOptions.Advanced,
			preference: PreferenceOptions.VeryHigh,
			details: 'Advanced audio engineer for church sound systems.',
		},
		{
			id: 53,
			type: TypeOptions.TechSlides,
			level: LevelOptions.Beginner,
			preference: PreferenceOptions.Low,
			details: 'Manage slide presentations during church gatherings.',
		},
		{
			id: 54,
			type: TypeOptions.TechVideoDirector,
			level: LevelOptions.Intermediate,
			preference: PreferenceOptions.High,
			details: 'Video director for church events and services.',
		},
		{
			id: 55,
			type: TypeOptions.Prayer,
			level: LevelOptions.Advanced,
			preference: PreferenceOptions.VeryHigh,
			details: 'Lead and coordinate prayer sessions for the church community.',
		},
		{
			id: 56,
			type: TypeOptions.PastoralCare,
			level: LevelOptions.Beginner,
			preference: PreferenceOptions.Low,
			details: 'Provide basic pastoral care and support to church members.',
		},
		{
			id: 57,
			type: TypeOptions.TechLighting,
			level: LevelOptions.Intermediate,
			preference: PreferenceOptions.High,
			details: 'Lighting technician for church worship and events.',
		},
		{
			id: 58,
			type: TypeOptions.TechGeneral,
			level: LevelOptions.Advanced,
			preference: PreferenceOptions.VeryHigh,
			details: 'Provide advanced technical support for church functions.',
		},
		{
			id: 59,
			type: TypeOptions.TechCameras,
			level: LevelOptions.Beginner,
			preference: PreferenceOptions.Low,
			details: 'Camera operator for church video production.',
		},
		{
			id: 61,
			type: TypeOptions.BandBass,
			level: LevelOptions.Advanced,
			preference: PreferenceOptions.VeryHigh,
			details: 'Advanced bassist for church worship band.',
		},
		{
			id: 62,
			type: TypeOptions.TechGeneral,
			level: LevelOptions.Beginner,
			preference: PreferenceOptions.Low,
			details: 'Provide basic technical support for church events.',
		},
		{
			id: 63,
			type: TypeOptions.TechAudio,
			level: LevelOptions.Intermediate,
			preference: PreferenceOptions.High,
			details: 'Audio technician for church sound systems during services.',
		},
		{
			id: 64,
			type: TypeOptions.Prayer,
			level: LevelOptions.Advanced,
			preference: PreferenceOptions.VeryHigh,
			details: 'Lead and organize prayer sessions and intercessory prayer.',
		},
		{
			id: 65,
			type: TypeOptions.PastoralCare,
			level: LevelOptions.Beginner,
			preference: PreferenceOptions.Low,
			details: 'Provide basic pastoral care to church members in need.',
		},
		{
			id: 66,
			type: TypeOptions.TechCameras,
			level: LevelOptions.Intermediate,
			preference: PreferenceOptions.High,
			details: 'Operate cameras for church video recordings.',
		},
		{
			id: 67,
			type: TypeOptions.TechSlides,
			level: LevelOptions.Advanced,
			preference: PreferenceOptions.VeryHigh,
			details: 'Slide and presentation management during church services.',
		},
		{
			id: 68,
			type: TypeOptions.TechLighting,
			level: LevelOptions.Beginner,
			preference: PreferenceOptions.Low,
			details: 'Basic lighting technician for church events.',
		},
		{
			id: 69,
			type: TypeOptions.BandVocals,
			level: LevelOptions.Intermediate,
			preference: PreferenceOptions.High,
			details: 'Vocalist for church worship team.',
		},
		{
			id: 71,
			type: TypeOptions.BandElectricGuitar,
			level: LevelOptions.Beginner,
			preference: PreferenceOptions.Low,
			details: 'Electric guitarist for church worship band (beginner level).',
		},
		{
			id: 72,
			type: TypeOptions.TechVideoDirector,
			level: LevelOptions.Intermediate,
			preference: PreferenceOptions.High,
			details: 'Video director for church live streaming (intermediate level).',
		},
		{
			id: 73,
			type: TypeOptions.TechAudio,
			level: LevelOptions.Advanced,
			preference: PreferenceOptions.VeryHigh,
			details: 'Advanced audio engineer for church sound systems.',
		},
		{
			id: 74,
			type: TypeOptions.TechSlides,
			level: LevelOptions.Beginner,
			preference: PreferenceOptions.Low,
			details:
				'Slide and presentation management for church services (beginner level).',
		},
		{
			id: 75,
			type: TypeOptions.Prayer,
			level: LevelOptions.Intermediate,
			preference: PreferenceOptions.High,
			details: 'Lead and organize prayer sessions for the church community.',
		},
		{
			id: 76,
			type: TypeOptions.PastoralCare,
			level: LevelOptions.Advanced,
			preference: PreferenceOptions.VeryHigh,
			details: 'Provide specialized pastoral care and counseling.',
		},
		{
			id: 77,
			type: TypeOptions.TechLighting,
			level: LevelOptions.Intermediate,
			preference: PreferenceOptions.High,
			details: 'Lighting technician for church stage and events.',
		},
		{
			id: 78,
			type: TypeOptions.TechGeneral,
			level: LevelOptions.Advanced,
			preference: PreferenceOptions.VeryHigh,
			details:
				'Provide advanced technical support for church functions and events.',
		},
		{
			id: 79,
			type: TypeOptions.TechCameras,
			level: LevelOptions.Beginner,
			preference: PreferenceOptions.Low,
			details: 'Camera operator for church video production (beginner level).',
		},
		{
			id: 80,
			type: TypeOptions.BandAcousticGuitar,
			level: LevelOptions.Intermediate,
			preference: PreferenceOptions.High,
			details:
				'Acoustic guitarist for church worship team (intermediate level).',
		},
	],
};

const DB = new Database(structuredClone(preexistingData));

export default DB;
