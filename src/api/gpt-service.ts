import DB from '@/db/db';
import { Experience, LevelOptions, MinistryEvent, Team, TypeOptions, User } from '@/db/types';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

export const submitPrompt = async (prompt: string) => {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
    });

    if (chatCompletion.choices[0].message.content) {
        // console.log(chatCompletion.choices[0].message.content)
        // console.log(JSON.parse(chatCompletion.choices[0].message.content));
        return JSON.parse(chatCompletion.choices[0].message.content);
    }
}

const buildVolunteerListPrompt = (users: (UserWithServeHistory | undefined)[]) => {
    let promptString = '';

    users.forEach((user, index) => {
        const availability = `${user?.preferredNumWeeksServing}x a month`;
        //@ts-ignore
        const proficiencies = user?.experiences.reduce((acc: string, xp: Experience) => acc + `${parseLevelToString(xp.level)} ${xp.type}, `, '');
        const preference = `Prefers ${getMostPreferredType(user?.experiences)}`;
        const numTimesServed = `Served ${user?.numTimesServed} times recently`;
        promptString += `${index+1}. ${user?.firstName} ${user?.lastName} id: ${user?.id} (Availability: ${availability} | Proficiencies: ${proficiencies} | Preference: ${preference} | Recent Serve Amount: ${numTimesServed})\n`
    });
    return promptString;
};

const buildEventDetailsPrompt = (events: MinistryEvent[]) => {
    let promptString = '';

    events.forEach((ministryEvent, index) => {
        promptString += `${index+1}. id: ${ministryEvent.id}, date: ${ministryEvent.date}, event_team_id: ${45 + index}\n`;
    });
    return promptString;
};

const buildTeamRequirementsPrompt = (team: Team) => {
    const requiredRoles = team.roles_required.map((roleId) => {
        return DB.getRole(roleId as number);
    });

    const roleCounts = requiredRoles.reduce((acc, role) => {
        acc[role.type] = (acc[role.type] || 0) + 1;
        return acc;
    }, {});

    const promptString = Object.keys(roleCounts)
        .map(role => `- Role: ${role}, Number needed: ${roleCounts[role]}`)
        .join('\n  ');

    return promptString;
};

const parseLevelToString = (level: LevelOptions): string => {
	const levelMap: { [key in LevelOptions]: string } = {
		[LevelOptions.Beginner]: 'Beginner',
		[LevelOptions.Intermediate]: 'Intermediate',
		[LevelOptions.Advanced]: 'Advanced',
		[LevelOptions.Expert]: 'Expert',
	};
	return levelMap[level];
};

const getMostPreferredType = (experiences?: any[]): TypeOptions => {
	const preferredExp = experiences?.reduce((highest, current) => {
		return current.preference > highest.preference ? current : highest;
	});
	return preferredExp.type;
};

type UserWithServeHistory = User & {
    numTimesServed: number;
};

export type AISingleTeamSchedule = {
    events: [
        {
            id: number;
            date: string;
            eventTeam: {
                id: number,
                team: 1,
                at_capacity: true,
                scheduled_users: [
                    {id: 1, reason: "I scheduled this person because..."},
                    {id: 9, reason: "I scheduled this person because..."},
                    {id: 20, reason: "I scheduled this person because..."},
                    {id: 24, reason: "I scheduled this person because..."},
                    {id: 35, reason: "I scheduled this person because..."},
                    {id: 41, reason: "I scheduled this person because..."},
                    {id: 53, reason: "I scheduled this person because..."},
                    {id: 60, reason: "I scheduled this person because..."},
                    {id: 62, reason: "I scheduled this person because..."}
                ]
            }
        }
    ]
};

export const generateTeamSchedule = async (team: Team, events: MinistryEvent[]) => {
    const teamMemberIds = team.users;
    const fullUsers = teamMemberIds.map((id) => DB.getUser(id as number));
    const pastEvents = DB.getPastEvents();
    const usersWithServeHistory: UserWithServeHistory[] = fullUsers.map((user) => {
        const numTimesServed = pastEvents.reduce((total, event) => {
            let numTimesScheduled = 0;
            event.eventTeams.forEach((eventTeam) => {
                const event_team = DB.getEventTeam(eventTeam as number);
                //@ts-ignore
                const userWasScheduled = event_team?.scheduled_users.includes(user.id);
                userWasScheduled && numTimesScheduled++;
            })
            return total + numTimesScheduled;
        }, 0);

        return {
            ...(user as User),
            numTimesServed
        }
    });

    let prompt = `
    Given the following volunteer and scheduling information:

    We have ${teamMemberIds.length} volunteers with different levels of experience, different availability, different proficiencies, and different preferences, detailed below:

    ${buildVolunteerListPrompt(usersWithServeHistory)}

    Events To Schedule For:
    ${buildEventDetailsPrompt(events)}

    Team Requirements:
    ${buildTeamRequirementsPrompt(team)}

    I need to schedule ${events.length} events, ensuring we have a mix of experience levels and no one is overworked. Who should be scheduled for the upcoming events, considering volunteer availability, experience, preferences, and recent scheduling patterns?
    Also include your reasoning for scheduling each person.

    Return the data in a format as depicted in the following example. Return only a JSON string.
    {
        events: [
            {
                id: 5,
                date: '2023-10-08',
                eventTeam: {
                    id: 46,
                    team: 1,
                    at_capacity: true,
                    scheduled_users: [
                        {id: 1, reason: "I scheduled this person because..."},
                        {id: 9, reason: "I scheduled this person because..."},
                        {id: 20, reason: "I scheduled this person because..."},
                        {id: 24, reason: "I scheduled this person because..."},
                        {id: 35, reason: "I scheduled this person because..."},
                        {id: 41, reason: "I scheduled this person because..."},
                        {id: 53, reason: "I scheduled this person because..."},
                        {id: 60, reason: "I scheduled this person because..."},
                        {id: 62, reason: "I scheduled this person because..."}
                    ]
                },
            },
            {
                id: 49,
                date: '2023-10-15',
                eventTeam: {
                    id: 34,
                    team: 1,
                    at_capacity: true,
                    scheduled_users: [
                        {id: 1, reason: "I scheduled this person because..."},
                        {id: 9, reason: "I scheduled this person because..."},
                        {id: 20, reason: "I scheduled this person because..."},
                        {id: 24, reason: "I scheduled this person because..."},
                        {id: 35, reason: "I scheduled this person because..."},
                        {id: 41, reason: "I scheduled this person because..."},
                        {id: 53, reason: "I scheduled this person because..."},
                        {id: 60, reason: "I scheduled this person because..."},
                        {id: 62, reason: "I scheduled this person because..."}
                    ]
                },
            },
            {
                id: 52,
                date: '2023-10-22',
                eventTeam: {
                    id: 34,
                    team: 1,
                    at_capacity: true,
                    scheduled_users: [
                        {id: 1, reason: "I scheduled this person because..."},
                        {id: 9, reason: "I scheduled this person because..."},
                        {id: 20, reason: "I scheduled this person because..."},
                        {id: 24, reason: "I scheduled this person because..."},
                        {id: 35, reason: "I scheduled this person because..."},
                        {id: 41, reason: "I scheduled this person because..."},
                        {id: 53, reason: "I scheduled this person because..."},
                        {id: 60, reason: "I scheduled this person because..."},
                        {id: 62, reason: "I scheduled this person because..."}
                    ]
                },
            },
        ]
    }
    `;

	// console.log(prompt);
    console.log('Submitting to GPT API...');
	return await submitPrompt(prompt);
};

/**
 * TODOS
 * - Prepare list of volunteers in prompt format - DONE
 * - Prepare event and team requirements
 * - Figure out how to handle existing manual scheduling
 */

/**
 * Example prompt for Worship Team
 *

  Given the following volunteer and scheduling information:

  We have 20 volunteers with different levels of experience, different availability, different proficiencies, and different preferences, detailed below:

    1. John Doe id: 1 (Availability: 3x a month | Proficiencies: Intermediate Piano, Beginner Bass | Preference: Prefers Piano | Recent Serve Amount: Served 5 times recently)
    2. Alice Smith id: 2 (Availability: 2x a month | Proficiencies: Advanced Guitar, Intermediate Drums | Preference: Prefers Guitar | Recent Serve Amount: Served 3 times recently)
    3. Michael Johnson id: 3 (Availability: 1x a month | Proficiencies: Advanced Vocals, Intermediate Guitar | Preference: Prefers Vocals | Recent Serve Amount: Served 4 times recently)
    4. Sarah Brown id: 4 (Availability: 4x a month | Proficiencies: Advanced Bass, Intermediate Piano | Preference: Prefers Bass | Recent Serve Amount: Served 2 times recently)
    5. David Wilson id: 5 (Availability: 2x a month | Proficiencies: Advanced Drums, Intermediate Bass | Preference: Prefers Drums | Recent Serve Amount: Served 6 times recently)
    6. Emily Davis id: 6 (Availability: 3x a month | Proficiencies: Advanced Piano, Intermediate Vocals | Preference: Prefers Piano | Recent Serve Amount: Served 5 times recently)
    7. James Clark id: 7 (Availability: 2x a month | Proficiencies: Intermediate Guitar, Beginner Bass | Preference: Prefers Guitar | Recent Serve Amount: Served 4 times recently)
    8. Olivia Martinez id: 8 (Availability: 4x a month | Proficiencies: Intermediate Drums, Beginner Piano | Preference: Prefers Drums | Recent Serve Amount: Served 2 times recently)
    9. Liam Lee id: 9 (Availability: 1x a month | Proficiencies: Advanced Vocals, Intermediate Bass | Preference: Prefers Vocals | Recent Serve Amount: Served 3 times recently)
    10. Ava Garcia id: 10 (Availability: 2x a month | Proficiencies: Intermediate Piano, Beginner Drums | Preference: Prefers Piano | Recent Serve Amount: Served 4 times recently)
    11. Ivy id: 11 (Availability: 1x a month | Proficiencies: Intermediate Bass, Beginner Guitar | Preference: Prefers Bass | Recent Serve Amount: Served 2 times recently)
    12. James id: 12 (Availability: 4x a month | Proficiencies: Advanced Band Aux, Intermediate Piano | Preference: Prefers Drums | Recent Serve Amount: Served 3 times recently)
    13. Katie id: 13 (Availability: 2x a month | Proficiencies: Intermediate Vocals, Beginner Bass | Preference: Prefers Vocals | Recent Serve Amount: Served 4 times recently)
    14. Liam id: 14 (Availability: 1x a month | Proficiencies: Beginner Piano, Beginner Drums | Preference: Prefers Piano | Recent Serve Amount: Served 2 times recently)
    15. Mia id: 15 (Availability: 4x a month | Proficiencies: Intermediate Bass, Beginner Guitar | Preference: Prefers Bass | Recent Serve Amount: Served 3 times recently)
    16. Noah id: 16 (Availability: 2x a month | Proficiencies: Beginner Drums, Beginner Piano | Preference: Prefers Drums | Recent Serve Amount: Served 1 time recently)
    17. Olivia id: 17 (Availability: 1x a month | Proficiencies: Beginner Vocals, Beginner Bass | Preference: Prefers Vocals | Recent Serve Amount: Served 2 times recently)
    18. Patrick id: 18 (Availability: 4x a month | Proficiencies: Intermediate Piano, Beginner Drums | Preference: Prefers Piano | Recent Serve Amount: Served 3 times recently)
    19. Peter id: 19 (Availability: 2x a month | Proficiencies: Beginner Bass, Beginner Guitar | Preference: Prefers Bass | Recent Serve Amount: Served 1 time recently)
    20. Quinn id: 20 (Availability: 1x a month | Proficiencies: Beginner Drums, Beginner Piano | Preference: Prefers Drums | Recent Serve Amount: Served 2 times recently)

  Events To Schedule For:
    1. id: 5, date: 2023-10-08, event_team_id: 46
    2. id: 6, date: 2023-10-15, event_team_id: 47
    3. id: 7, date: 2023-10-22, event_team_id: 48

  Team Requirements:
  - Role: Vocals. Number needed: 4
  - Role: Keys, Number needed: 1
  - Role: Bass, Number needed: 1
  - Role: Electric Guitar, Number needed: 1
  - Role: Acoustic Guitar Number needed: 1
  - Role: Drums, Number needed: 1
  - Role: Band Aux, Number needed: 1

  I need to schedule 3 events for this month, ensuring we have a mix of experience levels and no one is overworked. Who should be scheduled for the upcoming events, considering volunteer availability, experience, preferences, and recent scheduling patterns?

  Return the data in a format as depicted in the following example. Return only JSON.
  [
    events: [
        {
            id: 5,
			date: '2023-10-08',
            eventTeams: {
                id: 46,
                team: 1,
                at_capacity: true,
                scheduled_users: [1, 9, 20, 24, 35, 41, 53, 60, 62]
            },
        },
        {
            id: 49,
			date: '2023-10-15',
            eventTeams: {
                id: 34,
                team: 1,
                at_capacity: true,
                scheduled_users: [1, 9, 20, 24, 35, 41, 53, 60, 62]
            },
        },
        {
            id: 52,
			date: '2023-10-22',
            eventTeams: {
                id: 34,
                team: 1,
                at_capacity: true,
                scheduled_users: [1, 9, 20, 24, 35, 41, 53, 60, 62]
            },
        },
    ]
  ]

 */
