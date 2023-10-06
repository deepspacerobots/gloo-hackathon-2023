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
	Admin = 'admin',
	TeamLead = 'team_lead',
	Volunteer = 'volunteer',
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
	age?: AgeOptions | 'all_ages';
	requirementSatisfaction?: boolean;
	event?: number | MinistryEvent;
	email?: string;
	secondaryConfirmation?: boolean;
	ministry?: number | Ministry;
	requireCandidateSignature?: boolean;
};

enum AgeOptions {
	AllAges = 'all_ages',
	TenPlus = 'ten_plus',
	EighteenPlus = 'eighteen_plus',
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
	BandVocals = 'band_vocals',
	BandKeys = 'band_keys',
	BandBass = 'band_bass',
	BandElectricGuitar = 'band_eletric_guitar',
	BandAcousticGuitar = 'band_acoustic_guitar',
	BandDrums = 'band_drums',
	BandAux = 'band_aux',
	TechGeneral = 'tech_general',
	TechCameras = 'tech_cameras',
	TechLighting = 'tech_lighting',
	TechAudio = 'tech_audio',
	TechSlides = 'tech_slides',
	TechVideoDirector = 'tech_video_director',
	Prayer = 'prayer',
	PastoralCare = 'pastoral_care',
}

enum LevelOptions {
	Beginner = 1,
	Intermediate = 2,
	Advanced = 3,
	Expert = 4,
}

enum PreferenceOptions {
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
	MainAuditorium = 'main_auditorium',
	SecondaryAuditorium = 'secondary_auditorium',
	KidsRoom = 'kids_room',
	YouthRoom = 'youth_room',
	Foyer = 'foyer',
}

enum RepeatOptions {
	Weekly = 'weekly',
	BiWeekly = 'bi_weekly',
	Monthly = 'monthly',
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
