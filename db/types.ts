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
	relatedVolunteer?: number; // user_id
	teams?: number[]; // team_id[]
	events?: number[]; // event_id[]
	messages?: number[]; // message_id[]
	blackoutDates?: DateTime[];
	preferredNumWeeksServing: number;
	experiences?: number[]; // experience_id[]
};

export enum RoleOptions {
	Admin = 'admin',
	TeamLead = 'team_lead',
	Volunteer = 'volunteer',
}

export type Message = {
	id: number;
	thread: number; // thread_id
	recipientId: number; // user_id
	senderId: number; // user_id
	content: string;
};

type DateTime = string;

export type Requirement = {
	id: number;
	title: string;
	description: string;
	age?: AgeOptions | 'all_ages';
	requirementSatisfaction?: boolean;
	event?: number; // event_id
	email?: string;
	secondaryConfirmation?: boolean;
	ministry: number; // ministry_id
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
	BandVocalsLead = 'band_vocals_lead',
	BandVocalsSupport = 'band_vocals_support',
	BandVocals = 'band_vocals',
	BandKeys = 'band_keys',
	BandKeys2 = 'band_keys2',
	BandBass = 'band_bass',
	BandGuitarLead = 'band_guitar_lead',
	BandGuitar2 = 'band_guitar2',
	BandAux = 'band_aux',
	TechGeneral = 'tech_general',
	TechCameras = 'tech_cameras',
	TechLighting = 'tech_lighting',
	TechAudio = 'tech_audio',
	TechSlides = 'tech_slides',
	TechVideoDirector = 'tech_video_director',
	SocialGreeting = 'social_greeting',
	SocialEgress = 'social_egress',
	Prayer = 'prayer',
	PastoralCare = 'pastoral_care',
	Admin = 'admin',
	SetupTeardown = 'setup_teardown',
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
	ministries: number[]; // ministry_id[]
	teams?: number[]; // team_id[]
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
	messages: number[]; // message_id[]
};

export type Team = {
	id: number;
	title: string;
	description?: string;
	roles: number[]; // role_id[]
	requirements?: number[]; // requirement_id[]
	teamLead: number; // user_id
};

export type Role = {
	id: number;
	// teamIds: number[]; // team_id[]
	type: TypeOptions;
	description?: string;
	experienceRequired: number; //
	user?: number; // user_id
	// requirements?: number[]; // requirement_id[]
};

export type Ministry = {
	id: number;
	title: string;
	description: string;
	logo?: string; // relative path to asset in /assets
	bannerImage?: string; // relative path to asset in /assets
	teams: number[]; // team_id[]
	// requirements?: number[]; // requirement_id[]
};

export type Organization = {
	id: number;
	name: string;
	description: string;
	address?: string;
	seniorPastor: number; // user_id
	logo?: string; // relative path to asset in /assets
	website?: string;
	brandColors?: string[];
};
