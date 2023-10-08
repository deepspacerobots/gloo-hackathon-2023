import { DBSchema, preexistingData } from '@/db/db';
import {
	EventTeam,
	Experience,
	Ministry,
	MinistryEvent,
	Organization,
	Requirement,
	Role,
	Team,
	User,
} from '@/db/types';
import { createContext, ReactNode, useContext, useState } from 'react';

type Props = {
	children: string | ReactNode | JSX.Element;
};

export type DBContextType = {
	db: DBSchema;
	getOrganization: (organizationId: number) => Organization | undefined;
	setOrganization: (payload: Organization) => Organization;
	getEvent: (eventId: number) => MinistryEvent | undefined;
	getAllEvents: () => MinistryEvent[] | undefined;
	getPastEvents: () => MinistryEvent[];
	getFutureEvents: () => MinistryEvent[];
	setEvent: (payload: MinistryEvent) => MinistryEvent;
	setEventTeams: (eventId: number, eventTeams: EventTeam[]) => EventTeam[];
	getEventTeam: (eventTeamId: number) => EventTeam | undefined;
	getMinistry: (ministryId: number) => Ministry | undefined;
	setMinistry: (payload: Ministry) => Ministry;
	getTeam: (teamId: number) => Team | undefined;
	getAllTeams: () => Team[];
	setTeam: (payload: Team) => Team;
	getRole: (roleId: number) => Role | undefined;
	setRole: (payload: Role) => Role;
	getRequirement: (requirementId: number) => Requirement | undefined;
	setRequirement: (payload: Requirement) => Requirement;
	getUser: (userId: number) => User | undefined;
	getUsers: () => User[];
	setUser: (payload: User) => User;
	getExperience: (experienceId: number) => Experience | undefined;
	setExperience: (payload: Experience) => Experience;
	setScheduledUsers: (
		teamId: number,
		eventId: number,
		users: number[] | null[]
	) => void;
	batchUpdateScheduledUsers: (updates: any[]) => void;
};

const DBContext = createContext<DBContextType>({} as any);

const DBProvider = ({ children }: Props): JSX.Element => {
	const [db, setDb] = useState<DBSchema>(preexistingData);

	const getOrganization = (
		organizationId: number
	): Organization | undefined => {
		const organization = db.organizations.find(
			(organization: Organization) => organization.id === organizationId
		);

		if (typeof organization?.seniorPastor == 'number') {
			organization.seniorPastor = db.users.find(
				(user: User) => organization.seniorPastor === user.id
			);
		}

		return organization;
	};

	const setOrganization = (payload: Organization): Organization => {
		payload.id = db.organizations[db.organizations.length - 1].id + 1;

		const newDb = structuredClone(db);
		newDb.organizations.push(payload);
		setDb(newDb);
		return payload;
	};

	const getEvent = (eventId: number): MinistryEvent | undefined => {
		const event = db.events.find(
			(event: MinistryEvent) => event.id === eventId
		);

		if (event) {
			if (event.ministries?.length && typeof event.ministries[0] === 'number') {
				event.ministries = db.ministries.filter((ministry: Ministry) =>
					(event.ministries as number[]).includes(ministry.id)
				);
			}

			if (event.teams?.length && typeof event.teams[0] === 'number') {
				event.teams = db.teams.filter((team: Team) =>
					(event.teams as number[]).includes(team.id)
				);
			}

			if (event.eventTeams?.length && typeof event.eventTeams[0] === 'number') {
				event.eventTeams = db.eventTeams.filter((eventTeam: EventTeam) =>
					(event.eventTeams as number[]).includes(eventTeam.id)
				);
			}
		}

		return event;
	};

	const getAllEvents = () => {
		return db.events.map(event => getEvent(event.id));
	}

	const getPastEvents = (): MinistryEvent[] => {
		const events = db.events;
		const now = new Date();

		return events.filter((event: MinistryEvent) => {
			const eventDate = new Date(event.date);
			return now > eventDate;
		});
	};

	const getFutureEvents = (): MinistryEvent[] => {
		const events = db.events;
		const now = new Date();

		return events.filter((event: MinistryEvent) => {
			const eventDate = new Date(event.date);
			return now < eventDate;
		});
	};

	const setEvent = (payload: MinistryEvent): MinistryEvent => {
		payload.id = db.events[db.events.length - 1].id + 1;
		const newDb = structuredClone(db);
		newDb.events.push(payload);
		setDb(newDb);
		return payload;
	};

	const setEventTeams = (
		eventId: number,
		eventTeams: EventTeam[]
	): EventTeam[] => {
		const newDb = structuredClone(db);
		const event = newDb.events.find((e) => e.id === eventId);
		if (event) {
			event.eventTeams = eventTeams;
			console.log({ event: event });
		}

		setDb(newDb);
		return eventTeams;
	};

	const getEventTeam = (eventTeamId: number): EventTeam | undefined => {
		const eventTeam = db.eventTeams.find(
			(eventTeam) => eventTeam.id === eventTeamId
		);
		return eventTeam;
	};

	const getMinistry = (ministryId: number): Ministry | undefined => {
		const ministry = db.ministries.find(
			(ministry: Ministry) => ministry.id === ministryId
		);

		if (ministry?.teams?.length && typeof ministry.teams[0] === 'number') {
			ministry.teams = db.teams.filter((team: Team) =>
				(ministry.teams as number[]).includes(team.id)
			);
		}

		return ministry;
	};

	const setMinistry = (payload: Ministry): Ministry => {
		payload.id = db.ministries[db.ministries.length - 1].id + 1;
		const newDb = structuredClone(db);
		newDb.ministries.push(payload);
		setDb(newDb);
		return payload;
	};

	const getTeam = (teamId: number): Team | undefined => {
		const team = db.teams.find((team: Team) => team.id === teamId);

		if (team) {
			if (team.roles?.length && typeof team.roles[0] === 'number') {
				team.roles = db.roles.filter((role: Role) =>
					(team.roles as number[]).includes(role.id)
				);
			}

			if (typeof team?.teamLead === 'number') {
				team.teamLead = db.users.find(
					(user: User) => team.teamLead === user.id
				);
			}

			if (team.users.length) {
				team.users = db.users.filter((user: User) =>
					(team.users as number[]).includes(user.id)
				);
			}
		}

		return team;
	};

	const getAllTeams = (): Team[] => {
		return db.teams;
	};

	const setTeam = (payload: Team): Team => {
		payload.id = db.teams[db.teams.length - 1].id + 1;
		const newDb = structuredClone(db);
		newDb.teams.push(payload);
		setDb(newDb);
		return payload;
	};

	const getRole = (roleId: number): Role | undefined => {
		const role = db.roles.find((role: Role) => role.id === roleId);

		if (typeof role?.user === 'number') {
			role.user = db.users.find((user: User) => role.user === user.id);
		}

		return role;
	};

	const setRole = (payload: Role): Role => {
		payload.id = db.roles[db.roles.length - 1].id + 1;
		const newDb = structuredClone(db);
		newDb.roles.push(payload);
		setDb(newDb);
		return payload;
	};

	const getRequirement = (requirementId: number): Requirement | undefined => {
		const requirement = db.requirements.find(
			(requirement: Requirement) => requirement.id === requirementId
		);

		if (requirement) {
			if (typeof requirement?.event === 'number') {
				requirement.event = db.events.find(
					(event: MinistryEvent) => requirement.event === event.id
				);
			}

			if (typeof requirement?.ministry === 'number') {
				requirement.ministry = db.ministries.find(
					(ministry: Ministry) => requirement.ministry === ministry.id
				);
			}
		}

		return requirement;
	};

	const setRequirement = (payload: Requirement): Requirement => {
		payload.id = db.requirements[db.requirements.length - 1].id + 1;
		const newDb = structuredClone(db);
		newDb.requirements.push(payload);
		setDb(newDb);
		return payload;
	};

	const getUser = (userId: number): User | undefined => {
		const user = db.users.find((user: User) => user.id === userId);

		if (user) {
			if (typeof user?.relatedVolunteer === 'number') {
				user.relatedVolunteer = db.users.find(
					(userIteration: User) => user.relatedVolunteer === userIteration.id
				);
			}

			if (user.teams?.length && typeof user.teams[0] === 'number') {
				user.teams = db.teams.filter((team: Team) =>
					(user.teams as number[]).includes(team.id)
				);
			}

			if (user.events?.length && typeof user.events[0] === 'number') {
				user.events = db.events.filter((event: MinistryEvent) =>
					(user.events as number[]).includes(event.id)
				);
			}
		}

		return user;
	};

	const getUsers = (): User[] => {
		return db.users;
	};

	const setUser = (payload: User): User => {
		payload.id = db.users[db.users.length - 1].id + 1;
		const newDb = structuredClone(db);
		newDb.users.push(payload);
		setDb(newDb);
		return payload;
	};

	const getExperience = (experienceId: number): Experience | undefined => {
		const experience = db.experiences.find(
			(experience: Experience) => experience.id === experienceId
		);

		return experience;
	};

	const setExperience = (payload: Experience): Experience => {
		payload.id = db.experiences[db.experiences.length - 1].id + 1;

		const newDb = structuredClone(db);
		newDb.experiences.push(payload);
		setDb(newDb);

		return payload;
	};

	const setScheduledUsers = (
		db: any, // Passing the current DB state directly
		teamId: number,
		eventId: number,
		users: number[] | null[]
	  ) => {
		if (!db || !db.events) {
			return;
		}

		const event = db.events.find((e: any) => e.id === eventId);
		const eventTeam = event?.eventTeams.find(
		  (e: any) => e.team === teamId
		);
	  
		if (eventTeam) {
		  eventTeam.scheduled_users = users;
		}
	  };
	  

	  const batchUpdateScheduledUsers = (updates: any[]) => {
		const newDb = structuredClone(db); // Make a clone of the current DB state
	  
		updates.forEach(update => {
		  const { teamId, eventId, users } = update;
		  setScheduledUsers(newDb, teamId, eventId, users); // Pass the newDb state directly
		});
	  
		setDb(newDb); // Set the state once after all updates are applied
	  };
	  
	  

	const provide = {
		db,
		getOrganization,
		setOrganization,
		getEvent,
		getAllEvents,
		getPastEvents,
		getFutureEvents,
		setEvent,
		setEventTeams,
		getEventTeam,
		getMinistry,
		setMinistry,
		getTeam,
		getAllTeams,
		setTeam,
		getRole,
		setRole,
		getRequirement,
		setRequirement,
		getUser,
		getUsers,
		setUser,
		getExperience,
		setExperience,
		setScheduledUsers,
		batchUpdateScheduledUsers
	};

	return <DBContext.Provider value={provide}>{children}</DBContext.Provider>;
};

export default DBProvider;

export const useDBContext = () => useContext<DBContextType>(DBContext);
