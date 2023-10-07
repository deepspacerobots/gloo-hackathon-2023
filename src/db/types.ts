export type User = {
	id: number;
	firstName: string;
	lastName: string;
	role: RoleOptions;
	address?: string;
	city?: string;
	state?: string;
	zip?: string;
	email: string;
	password: string;
	phone?: string;
	profilePhoto?: string; // relative path to asset in /assets
	relatedVolunteer?: number | User;
	teams?: number[] | Team[];
	events?: number[] | MinistryEvent[];
	messages?: number[] | Message[];
	blackoutDates?: DateTime[];
	preferredNumWeeksServing: number;
	experiences?: number[] | Experience[];
};

export enum RoleOptions {
	Admin = 'Admin',
	TeamLead = 'Team Lead',
	Volunteer = 'Volunteer',
}

export type Message = {
	id: number;
	thread: number | Thread;
	recipientId: number | User;
	senderId: number | User;
	content: string;
};

type DateTime = string;

export type Requirement = {
	id: number;
	title: string;
	description: string;
	age?: AgeOptions | 'All Ages';
	requirementSatisfaction?: boolean;
	event?: number | MinistryEvent;
	email?: string;
	secondaryConfirmation?: boolean;
	ministry?: number | Ministry;
	requireCandidateSignature?: boolean;
};

enum AgeOptions {
	AllAges = 'All Ages',
	TenPlus = '10+',
	EighteenPlus = '18+',
}

export type Experience = {
	id: number;
	// userId: number; // user_id
	type: TypeOptions;
	level: LevelOptions;
	preference: PreferenceOptions;
	details?: string;
};

export enum TypeOptions {
	BandVocals = 'Vocals',
	BandKeys = 'Keys',
	BandBass = 'Bass',
	BandElectricGuitar = 'Eletric Guitar',
	BandAcousticGuitar = 'Acoustic Guitar',
	BandDrums = 'Drums',
	BandAux = 'Band Aux',
	TechGeneral = 'Tech General',
	TechCameras = 'Cameras',
	TechLighting = 'Lighting',
	TechAudio = 'Audio',
	TechSlides = 'Slides',
	TechVideoDirector = 'Video Director',
	Prayer = 'Prayer',
	PastoralCare = 'Pastoral Care',
}

export enum LevelOptions {
	Beginner = 1,
	Intermediate = 2,
	Advanced = 3,
	Expert = 4,
}

export enum PreferenceOptions {
	Low = 1,
	Intermediate = 2,
	High = 3,
	VeryHigh = 4,
}

export type MinistryEvent = {
	id: number;
	title: string;
	date: string;
	time: string;
	description: string;
	where?: WhereOptions;
	whatToBring?: string;
	repeats?: RepeatOptions;
	ministries: number[] | Ministry[];
	teams?: number[] | Team[];
};

enum WhereOptions {
	MainAuditorium = 'Main Auditorium',
	SecondaryAuditorium = 'Secondary Auditorium',
	KidsRoom = 'Kids Room',
	YouthRoom = 'Youth Room',
	Foyer = 'Foyer',
}

enum RepeatOptions {
	Weekly = 'Weekly',
	BiWeekly = 'Bi-Weekly',
	Monthly = 'Monthly',
}

export type Thread = {
	id: number;
	messages: number[] | Message[];
};

export type Team = {
	id: number;
	title: string;
	description?: string;
	roles: number[] | Role[];
	requirements?: number[] | Requirement[];
	teamLead?: number | User;
};

export type Role = {
	id: number;
	// teamIds: number[]; // team_id[]
	type: TypeOptions;
	description?: string;
	experienceRequired: number;
	user?: number | User;
	// requirements?: number[]; // requirement_id[]
};

export type Ministry = {
	id: number;
	title: string;
	description: string;
	logo?: string; // relative path to asset in /public/img
	bannerImage?: string; // relative path to asset in /public/img
	teams: number[] | Team[];
	// requirements?: number[]; // requirement_id[]
};

export type Organization = {
	id: number;
	name: string;
	description: string;
	address?: string;
	seniorPastor?: number | User;
	logo?: string; // relative path to asset in /public/img
	website?: string;
	brandColors?: string[];
};
