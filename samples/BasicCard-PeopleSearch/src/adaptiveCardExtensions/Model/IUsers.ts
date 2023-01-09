export interface IUsers {
    id: string;
    displayName: string;
    givenName?: string;
    surname?: string;
    birthday?: string;
    personNotes?: string;
    isFavorite: boolean;
    jobTitle?: string;
    compstringName?: string;
    yomiCompstring?: string;
    department?: string;
    officeLocation?: string;
    profession?: string;
    userPrincipalName?: string;
    imAddress?: string;
    phones: string[];
}