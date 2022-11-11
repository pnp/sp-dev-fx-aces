import { IHttpClient } from "../dal/http/IHttpClient";

export class PeopleService {
    constructor(protected graphClient: IHttpClient, public currentUserId: string) {

    }
    public async getUsers(searchText?: string): Promise<any> {
        let query = `/v1.0/me/people?$filter=personType/class eq 'Person'`;
        if (searchText) {
            query += `&$search=\"${searchText}\"`;
        }
        let response = await this.graphClient.get(query);
        let data = await response.json();
        await Promise.all(data.value.map(async user => {
            let userResponse = await this.graphClient.get(`/users/${user.id}/photo/$value`);
            let photo = await userResponse.text();
            user.photo = `data:image/png;base64,${photo.replace("\"", "").replace("\"", "")}`;
        }));
        return data.value;
    }
}