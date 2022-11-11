// Represents attributes of an M365 Group
export interface IGroup {
    id: string;
    displayName: string;
    description?: string;
    visibility?: string;
    url?: string;
    thumbnail?: string;
    userRole?: string;
    teamsConnected?: boolean;
    connectedServices: IConnectedService[];
}

export interface IConnectedService {
    providerName: string;
    uri: string;
}

export interface IGroupCollection {
    value: IGroup[];
}