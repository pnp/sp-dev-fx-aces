export const WorkLocationOptions=[
    {
        "choice": "Remote",
        "value": "1"
    },
    {
        "choice": "Office",
        "value": "2"
    }
];

export const CheckinData = {
    UserIdentifier: "My Name",
    Survey: {
        title: "Check-in Option",
        questions: [
            {
                question: "Which location do you want to work from?",
                items: WorkLocationOptions
            },
            {
                question: "I am vaccinated"
            },
            {
                question: "I don't have Covid symptoms"
            }
        ]
    }
};

export class MockDataService {
    public getDefaultCheckInData = (): Promise<any> => {
        return Promise.resolve(CheckinData);
    }
}