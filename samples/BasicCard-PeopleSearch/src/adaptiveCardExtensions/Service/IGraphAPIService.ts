import { IUsers } from "../Model/IUsers";

export interface IGraphAPIService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getPaginatedResults(nextLink: string): Promise<any>;
    fetchUsers(filterText?: string): Promise<Array<IUsers>>;
}