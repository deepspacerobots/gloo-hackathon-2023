import DB from '@/db/db';
import { Experience, LevelOptions, Team, TypeOptions, User } from '@/db/types';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'my api key', // defaults to process.env["OPENAI_API_KEY"]
});

export const submitPrompt = async (prompt: string) => {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
    });

    console.log(chatCompletion.choices);
}

const worshipUsers = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        role: "volunteer",
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        email: 'john@example.com',
        password: 'password123',
        phone: '555-555-5555',
        memberStatus: true,
        profilePhoto: '/public/img/profile-pics/man-1.jpg',
        preferredNumWeeksServing: 3,
        teams: ["Worship"],
        experiences: [
            {
                type: TypeOptions.BandKeys,
                level: 2, // 1 = beginner, 2 = intermediate, 3 = advanced
                preference: 3, // preference is measured 1-3, lowest to highest
            },
            {
                type: TypeOptions.BandBass,
                level: 1,
                preference: 2,
            }
        ],
    },
    {
        id: 2,
        firstName: 'Alice',
        lastName: 'Smith',
        role: "volunteer",
        address: '456 Elm St',
        city: 'Smallville',
        state: 'NY',
        zip: '54321',
        email: 'alice@example.com',
        password: 'password456',
        phone: '555-555-5556',
        memberStatus: false,
        profilePhoto: '/public/img/profile-pics/woman-1.jpg',
        preferredNumWeeksServing: 2,
        teams: ["Worship"],
        experiences: [
            {
                "type": TypeOptions.BandElectricGuitar,
                "level": 3,
                "preference": 3
            },
            {
                "type": TypeOptions.BandDrums,
                "level": 2,
                "preference": 2
            }
        ]
    },
    {
        id: 3,
        firstName: 'Michael',
        lastName: 'Johnson',
        role: "volunteer",
        address: '789 Oak Ave',
        city: 'Hometown',
        state: 'TX',
        zip: '98765',
        email: 'michael@example.com',
        password: 'password789',
        phone: '555-555-5557',
        memberStatus: true,
        profilePhoto: '/public/img/profile-pics/man-2.jpg',
        preferredNumWeeksServing: 1,
        teams: ["Worship"],
        experiences: [
            {
                "type": TypeOptions.BandVocals,
                "level": 3,
                "preference": 3
            },
            {
                "type": TypeOptions.BandAcousticGuitar,
                "level": 2,
                "preference": 2
            }
        ]
    },
    {
        id: 4,
        firstName: 'Sarah',
        lastName: 'Brown',
        role: "volunteer",
        email: 'sarah@example.com',
        password: 'password890',
        phone: '555-555-5558',
        memberStatus: false,
        preferredNumWeeksServing: 4,
        teams: ["Worship"],
        experiences: [
            {
                "type": TypeOptions.BandBass,
                "level": 3,
                "preference": 3
            },
            {
                "type": TypeOptions.BandKeys,
                "level": 2,
                "preference": 2
            }
        ]
    },
    {
        id: 5,
        firstName: 'David',
        lastName: 'Wilson',
        role: "volunteer",
        email: 'david@example.com',
        password: 'password901',
        memberStatus: true,
        preferredNumWeeksServing: 2,
        teams: ["Worship"],
        experiences: [
            {
                "type": TypeOptions.BandDrums,
                "level": 3,
                "preference": 3
            },
            {
                "type": TypeOptions.BandBass,
                "level": 2,
                "preference": 2
            }
        ]
    },
    {
        id: 6,
        firstName: 'Emily',
        lastName: 'Davis',
        role: "volunteer",
        email: 'emily@example.com',
        password: 'password234',
        phone: '555-555-5559',
        memberStatus: false,
        preferredNumWeeksServing: 3,
        teams: ["Worship"],
        experiences: [
            {
                "type": TypeOptions.BandKeys,
                "level": 3,
                "preference": 3
            },
            {
                "type": TypeOptions.BandVocals,
                "level": 2,
                "preference": 2
            }
        ]
    },
    {
        id: 7,
        firstName: 'James',
        lastName: 'Clark',
        role: "volunteer",
        email: 'james@example.com',
        password: 'password567',
        phone: '555-555-5560',
        memberStatus: true,
        preferredNumWeeksServing: 2,
        teams: ["Worship"],
        experiences: [
            {
                "type": TypeOptions.BandElectricGuitar,
                "level": 2,
                "preference": 3
            },
            {
                "type": TypeOptions.BandBass,
                "level": 1,
                "preference": 2
            }
        ]
    },
    {
        id: 8,
        firstName: 'Olivia',
        lastName: 'Martinez',
        role: "volunteer",
        email: 'olivia@example.com',
        password: 'password890',
        phone: '555-555-5561',
        memberStatus: false,
        preferredNumWeeksServing: 4,
        teams: ["Worship"],
        experiences: [
            {
                "type": TypeOptions.BandDrums,
                "level": 2,
                "preference": 3
            },
            {
                "type": TypeOptions.BandKeys,
                "level": 1,
                "preference": 2
            }
        ]
    },
    {
        id: 9,
        firstName: 'Liam',
        lastName: 'Lee',
        role: "volunteer",
        email: 'liam@example.com',
        password: 'password123',
        memberStatus: true,
        preferredNumWeeksServing: 1,
        teams: ["Worship"],
        experiences: [
            {
                "type": TypeOptions.BandVocals,
                "level": 3,
                "preference": 3
            },
            {
                "type": TypeOptions.BandBass,
                "level": 2,
                "preference": 2
            }
        ]
    },
    {
        id: 10,
        firstName: 'Ava',
        lastName: 'Garcia',
        role: "volunteer",
        email: 'ava@example.com',
        password: 'password456',
        phone: '555-555-5562',
        memberStatus: false,
        preferredNumWeeksServing: 2,
        teams: ["Worship"],
        experiences: [
            {
                "type": TypeOptions.BandKeys,
                "level": 2,
                "preference": 3
            },
            {
                "type": TypeOptions.BandDrums,
                "level": 1,
                "preference": 2
            }
        ]
    },
];

const pastEvents = DB.events;

const buildVolunteerListPrompt = (users: (User | undefined)[]) => {
    const completeUsers = users?.map((user) => DB.getUser(user?.id as number));
    console.log(completeUsers)
    let promptString = '';

    // completeUsers.forEach((user, index) => {
    //     const availability = `${user?.preferredNumWeeksServing}x a month`;
    //     const proficiencies = user?.experiences.reduce((acc: string, xp: Experience) => acc + `${parseLevelToString(xp.level)} ${xp.type}, `, '');
    //     const preference = `Prefers ${getMostPreferredType(user?.experiences)}`;
    //     promptString += `${index+1}. ${user?.firstName} ${user?.lastName} (Availability: ${availability} | Proficiencies: ${proficiencies} | Preference: ${preference} | Served ${Math.floor(Math.random() * 5) + 1} times recently)\n`
    // })
    return promptString;
};

const parseLevelToString = (level: LevelOptions): string => {
    const levelMap: { [key in LevelOptions]: string } = {
        [LevelOptions.Beginner]: "Beginner",
        [LevelOptions.Intermediate]: "Intermediate",
        [LevelOptions.Advanced]: "Advanced",
        [LevelOptions.Expert]: "Expert",
    }
    return levelMap[level];
};

const getMostPreferredType = (experiences?: any[]): TypeOptions => {
    const preferredExp = experiences?.reduce((highest, current) => {
        return current.preference > highest.preference ? current : highest;
    });
    return preferredExp.type;
};


export const generateTeamSchedule = (team: Team) => {
    const teamMemberIds = team.users;
    const fullUsers = teamMemberIds.map((id) => DB.getUser(id as number));
    let prompt = `
    Given the following volunteer and scheduling information:

    We have 20 volunteers with different levels of experience, different availability, different proficiencies, and different preferences, detailed below:

    ${buildVolunteerListPrompt(fullUsers)}
    `;

    return submitPrompt(prompt);
};

/**
 * TODOS
 * - Prepare list of volunteers in prompt format
 * - Prepare list of events in prompt format
 * - Prepare team requirements
 */

/**
 * Example prompt for Worship Team
 * 
 
  Given the following volunteer and scheduling information:

  We have 20 volunteers with different levels of experience, different availability, different proficiencies, and different preferences, detailed below:

    1. John Doe (Availability: 3x a month | Proficiencies: Intermediate Piano, Beginner Bass | Preference: Prefers Piano | Served 5 times recently)
    2. Alice Smith (Availability: 2x a month | Proficiencies: Advanced Guitar, Intermediate Drums | Preference: Prefers Guitar | Served 3 times recently)
    3. Michael Johnson (Availability: 1x a month | Proficiencies: Advanced Vocals, Intermediate Guitar | Preference: Prefers Vocals | Served 4 times recently)
    4. Sarah Brown (Availability: 4x a month | Proficiencies: Advanced Bass, Intermediate Piano | Preference: Prefers Bass | Served 2 times recently)
    5. David Wilson (Availability: 2x a month | Proficiencies: Advanced Drums, Intermediate Bass | Preference: Prefers Drums | Served 6 times recently)
    6. Emily Davis (Availability: 3x a month | Proficiencies: Advanced Piano, Intermediate Vocals | Preference: Prefers Piano | Served 5 times recently)
    7. James Clark (Availability: 2x a month | Proficiencies: Intermediate Guitar, Beginner Bass | Preference: Prefers Guitar | Served 4 times recently)
    8. Olivia Martinez (Availability: 4x a month | Proficiencies: Intermediate Drums, Beginner Piano | Preference: Prefers Drums | Served 2 times recently)
    9. Liam Lee (Availability: 1x a month | Proficiencies: Advanced Vocals, Intermediate Bass | Preference: Prefers Vocals | Served 3 times recently)
    10. Ava Garcia (Availability: 2x a month | Proficiencies: Intermediate Piano, Beginner Drums | Preference: Prefers Piano | Served 4 times recently)
    11. Ivy (Availability: 1x a month | Proficiencies: Intermediate Bass, Beginner Guitar | Preference: Prefers Bass | Served 2 times recently)
    12. James (Availability: 4x a month | Proficiencies: Advanced Drums, Intermediate Piano | Preference: Prefers Drums | Served 3 times recently)
    13. Katie (Availability: 2x a month | Proficiencies: Intermediate Vocals, Beginner Bass | Preference: Prefers Vocals | Served 4 times recently)
    14. Liam (Availability: 1x a month | Proficiencies: Beginner Piano, Beginner Drums | Preference: Prefers Piano | Served 2 times recently)
    15. Mia (Availability: 4x a month | Proficiencies: Intermediate Bass, Beginner Guitar | Preference: Prefers Bass | Served 3 times recently)
    16. Noah (Availability: 2x a month | Proficiencies: Beginner Drums, Beginner Piano | Preference: Prefers Drums | Served 1 time recently)
    17. Olivia (Availability: 1x a month | Proficiencies: Beginner Vocals, Beginner Bass | Preference: Prefers Vocals | Served 2 times recently)
    18. Patrick (Availability: 4x a month | Proficiencies: Intermediate Piano, Beginner Drums | Preference: Prefers Piano | Served 3 times recently)
    19. Peter (Availability: 2x a month | Proficiencies: Beginner Bass, Beginner Guitar | Preference: Prefers Bass | Served 1 time recently)
    20. Quinn (Availability: 1x a month | Proficiencies: Beginner Drums, Beginner Piano | Preference: Prefers Drums | Served 2 times recently)
  
  Event Dates:
  - 10/08/2023, 10/15/2023, 10/22/2023, 10/29/2023

  Team Requirements:
  - I need 8 people for each event; 1 drummer, 1 bassist, 1 guitarist, 1 piano, and 4 vocalists.

  I need to schedule 4 events for this month, ensuring we have a mix of experience levels and no one is overworked. Who should be scheduled for the upcoming events, considering volunteer availability, experience, preferences, and recent scheduling patterns?

  Return the data in this format:
  [
    event: {
      volunteers: []
    },
    event: {
      volunteers: []
    },
    event: {
      volunteers: []
    },
    event: {
      volunteers: []
    },
  ]

 */
