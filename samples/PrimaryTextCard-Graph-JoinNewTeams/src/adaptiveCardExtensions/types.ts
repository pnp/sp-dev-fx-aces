export type Team = {
    displayName: string;
    createdDateTime: Date | string;
    description: string;
    picture: string;
    id: string;
};

export type RetrievedTeams = {
    "@odata.count": number;
    value: Team[];
    userId: string;
};

export type Photo ={
    teamId: string;
    value: string;
};