import { AISingleTeamSchedule } from '@/hooks/useGPT';

export const exampleWorshipTeamSchedules: AISingleTeamSchedule = {
	events: [
		{
			id: 5,
			date: '2023-10-10',
			eventTeam: {
				id: 45,
				team: 1,
				at_capacity: true,
				scheduled_users: [
					{
						id: 3,
						role: 'Keys',
						reason: 'Michael has not served recently and prefers keys with advanced proficiency.',
					},
					{
						id: 7,
						role: 'Vocals',
						reason: 'Scheduled Daniel for vocals as he has intermediate proficiency and has served only once recently.',
					},
					{
						id: 8,
						role: 'Vocals',
						reason: 'Scheduled Mia for vocals due to her preference, intermediate proficiency, and having served only once recently.',
					},
					{
						id: 12,
						role: 'Vocals',
						reason: 'Henry has advanced proficiency in vocals, although he served 3 times recently, he\'s still within his 2x a month availability.',
					},
					{ id: 16, role: 'Band Aux', reason: 'Evelyn hasn’t been scheduled recently and prefers Band Aux.' },
					{
						id: 9,
						role: 'Eletric Guitar',
						reason: 'Liam prefers electric guitar with intermediate proficiency and is within his monthly availability.',
					},
					{
						id: 2,
						role: 'Bass',
						reason: 'Alice prefers bass, has beginner proficiency and is within her monthly availability.',
					},
					{
						id: 10,
						role: 'Acoustic Guitar',
						reason: 'Emma has intermediate proficiency in Band Aux but was chosen for Acoustic Guitar to balance the team\'s skills.',
					},
					{
						id: 9,
						role: 'Drums',
						reason: 'Avery has advanced proficiency and prefers drums, is within the monthly availability.',
					},
				],
			},
		},
		{
			id: 6,
			date: '2023-10-15',
			eventTeam: {
				id: 46,
				team: 1,
				at_capacity: true,
				scheduled_users: [
					{
						id: 19,
						role: 'Keys',
						reason: 'Chloe prefers keys, has advanced proficiency and is within her monthly availability.',
					},
					{
						id: 18,
						role: 'Vocals',
						reason: 'Ethan has intermediate proficiency in vocals and is within his monthly availability.',
					},
					{
						id: 1,
						role: 'Vocals',
						reason: 'John has intermediate proficiency and is within his monthly availability, although prefers keys but was needed for vocals.',
					},
					{
						id: 17,
						role: 'Vocals',
						reason: 'Sophia has advanced proficiency in bass but was scheduled for vocals to meet the requirements.',
					},
					{
						id: 24,
						role: 'Band Aux',
						reason: 'Emma prefers Band Aux, has intermediate proficiency and is within her monthly availability.',
					},
					{
						id: 11,
						role: 'Eletric Guitar',
						reason: 'Sophia prefers electric guitar with advanced proficiency and is within her monthly availability.',
					},
					{
						id: 13,
						role: 'Bass',
						reason: 'Ella prefers bass with beginner proficiency and is within her monthly availability.',
					},
					{
						id: 5,
						role: 'Acoustic Guitar',
						reason: 'Robert prefers acoustic guitar, has advanced proficiency and is within his monthly availability.',
					},
					{
						id: 15,
						role: 'Drums',
						reason: 'Mason has intermediate proficiency and prefers drums, is within the monthly availability.',
					},
				],
			},
		},
		{
			id: 7,
			date: '2023-10-22',
			eventTeam: {
				id: 47,
				team: 1,
				at_capacity: true,
				scheduled_users: [
					{
						id: 6,
						role: 'Keys',
						reason: 'Grace has not been overworked recently, prefers keys with advanced proficiency.',
					},
					{
						id: 18,
						role: 'Vocals',
						reason: 'Re-scheduled Ethan for vocals due to limited availability of vocalists and he is within his monthly capacity.',
					},
					{
						id: 20,
						role: 'Vocals',
						reason: 'Emma has intermediate proficiency in vocals, and while she prefers acoustic guitar, she\'s needed for vocals here.',
					},
					{
						id: 8,
						role: 'Vocals',
						reason: 'Re-scheduled Mia for vocals due to her intermediate proficiency and preference.',
					},
					{
						id: 16,
						role: 'Band Aux',
						reason: 'Re-scheduled Evelyn for Band Aux as she hasn’t been scheduled recently and it’s her preference.',
					},
					{
						id: 14,
						role: 'Eletric Guitar',
						reason: 'Sophie has advanced proficiency in electric guitar, which is also her preference.',
					},
					{
						id: 48,
						role: 'Bass',
						reason: 'Sophia has advanced proficiency and prefers bass, she is also within her monthly availability.',
					},
					{
						id: 20,
						role: 'Acoustic Guitar',
						reason: 'Emma was rescheduled due to her intermediate proficiency in acoustic guitar to meet the team’s need.',
					},
					{
						id: 42,
						role: 'Drums',
						reason: 'Evelyn has advanced proficiency in drums and hasn’t been scheduled recently, thus balancing the workload.',
					},
				],
			},
		},
	],
};

export const exampleTechTeamSchedules = {
	events: [
		{
			id: 5,
			date: '2023-10-10',
			eventTeam: {
				id: 45,
				team: 2,
				at_capacity: true,
				scheduled_users: [
					{
						id: 7,
						role: 'Lighting',
						reason: 'James has intermediate proficiency in lighting, prefers it and has served only once recently.',
					},
					{
						id: 25,
						role: 'Cameras',
						reason: 'Lucas prefers cameras and has intermediate proficiency, and hasn’t been overworked.',
					},
					{
						id: 52,
						role: 'Cameras',
						reason: 'Olivia G. has intermediate proficiency in cameras, it’s her preference and is within her availability.',
					},
					{
						id: 14,
						role: 'Audio',
						reason: 'William prefers audio and has intermediate proficiency, fits the requirement for this role.',
					},
					{
						id: 8,
						role: 'Slides',
						reason: 'Olivia M. prefers slides, has beginner proficiency and her availability allows for scheduling.',
					},
					{
						id: 12,
						role: 'Video Director',
						reason: 'Sophia H. has advanced proficiency and prefers the video director role.',
					},
					{
						id: 46,
						role: 'Tech General',
						reason: 'Olivia Mo. has advanced proficiency in tech general and prefers this role, she has been served only once recently.',
					},
				],
			},
		},
		{
			id: 6,
			date: '2023-10-15',
			eventTeam: {
				id: 46,
				team: 2,
				at_capacity: true,
				scheduled_users: [
					{
						id: 59,
						role: 'Tech General',
						reason: 'William J. has advanced proficiency, prefers tech general and is within his monthly availability.',
					},
					{
						id: 27,
						role: 'Cameras',
						reason: 'Mason has advanced proficiency in lighting, but is needed for cameras to ensure diversity in roles.',
					},
					{
						id: 18,
						role: 'Cameras',
						reason: 'Olivia G. is scheduled again for cameras due to her proficiency and the team’s need.',
					},
					{
						id: 56,
						role: 'Audio',
						reason: 'Sophia He. has advanced proficiency in audio and prefers this role, aligning with the team’s needs.',
					},
					{
						id: 15,
						role: 'Slides',
						reason: 'Michael B. is preferred for slides, has beginner proficiency and hasn’t been overworked.',
					},
					{
						id: 19,
						role: 'Video Director',
						reason: 'Daniel is scheduled for his intermediate proficiency in video directing and preference for the role.',
					},
					{
						id: 32,
						role: 'Lighting',
						reason: 'Scarlett, although prefers tech general, is scheduled for lighting due to her beginner proficiency and team’s requirement.',
					},
				],
			},
		},
		{
			id: 7,
			date: '2023-10-22',
			eventTeam: {
				id: 47,
				team: 2,
				at_capacity: true,
				scheduled_users: [
					{
						id: 33,
						role: 'Tech General',
						reason: 'Benjamin is scheduled for his intermediate proficiency and preference for tech general, aligning with the team\'s needs.',
					},
					{
						id: 25,
						role: 'Cameras',
						reason: 'Lucas is scheduled again for cameras to meet the team’s requirement and considering his preference and proficiency.',
					},
					{
						id: 34,
						role: 'Cameras',
						reason: 'Hannah, although prefers lighting, is scheduled for cameras due to the team’s need and her diverse skills.',
					},
					{
						id: 50,
						role: 'Audio',
						reason: 'Charlotte is scheduled for her intermediate proficiency in audio and preference for the role.',
					},
					{
						id: 6,
						role: 'Slides',
						reason: 'Michael B. is scheduled again for slides, considering his preference and the team’s need.',
					},
					{
						id: 44,
						role: 'Video Director',
						reason: 'Ava has intermediate proficiency in video directing and preference for the role.',
					},
					{
						id: 5,
						role: 'Lighting',
						reason: 'Ella has advanced proficiency and prefers lighting, aligning with both her preference and the team’s needs.',
					},
				],
			},
		},
	],
};

export const examplePrayerTeamSchedules = {
	events: [
		{
			id: 5,
			date: '2023-10-10',
			eventTeam: {
				id: 45,
				team: 3,
				at_capacity: true,
				scheduled_users: [
					{
						id: 4,
						role: 'Prayer',
						reason: 'Sarah is scheduled for prayer as it aligns with her preference and beginner proficiency, and she can serve up to 4 times a month.',
					},
					{
						id: 6,
						role: 'Prayer',
						reason: 'Emily is chosen for her advanced proficiency in prayer and preference, aligning with the team’s needs.',
					},
					{
						id: 47,
						role: 'Pastoral Care',
						reason: 'James is chosen for pastoral care because it’s his preference, and he has not served recently, balancing the workload.',
					},
					{
						id: 5,
						role: 'Pastoral Care',
						reason: 'David is selected for his intermediate proficiency in pastoral care and because it is his preference, but this will be his last availability for the month.',
					},
				],
			},
		},
		{
			id: 6,
			date: '2023-10-15',
			eventTeam: {
				id: 46,
				team: 3,
				at_capacity: true,
				scheduled_users: [
					{
						id: 22,
						role: 'Prayer',
						reason: 'Olivia is scheduled for prayer as she has advanced proficiency and it is her preference; she has one more availability this month.',
					},
					{
						id: 10,
						role: 'Prayer',
						reason: 'Lily is chosen because she prefers prayer and has advanced proficiency, aligning with the team’s requirements.',
					},
					{
						id: 58,
						role: 'Pastoral Care',
						reason: 'Ava M. is chosen for pastoral care due to her advanced proficiency and preference, and she hasn’t served recently.',
					},
					{
						id: 51,
						role: 'Pastoral Care',
						reason: 'Liam P. is selected for pastoral care due to his preference and advanced proficiency, and he hasn’t served recently.',
					},
				],
			},
		},
		{
			id: 7,
			date: '2023-10-22',
			eventTeam: {
				id: 47,
				team: 3,
				at_capacity: true,
				scheduled_users: [
					{
						id: 37,
						role: 'Prayer',
						reason: 'Samuel is scheduled for prayer due to his advanced proficiency and preference, aligning with the team’s need.',
					},
					{
						id: 45,
						role: 'Prayer',
						reason: 'William is selected for his advanced proficiency in prayer and his preference for the role.',
					},
					{
						id: 15,
						role: 'Pastoral Care',
						reason: 'Ethan is chosen for pastoral care because of his advanced proficiency and preference for the role.',
					},
					{
						id: 16,
						role: 'Pastoral Care',
						reason: 'James J. is scheduled again for pastoral care because it’s his preference and he has intermediate proficiency.',
					},
				],
			},
		},
	],
};
