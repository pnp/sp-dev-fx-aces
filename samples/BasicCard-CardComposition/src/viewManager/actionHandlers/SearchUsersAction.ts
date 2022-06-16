import { PeopleService } from "../../service/PeopleService";
import { IActionHandler } from "./IActionHandler";

export class SearchUsersAction implements IActionHandler{
    constructor(protected peopleService: PeopleService) {
    }
    public shouldHandleAction(actionId: string): boolean {
        return actionId === "PeopleSearchInputAction";
    }
    public async handleAction(action: { id: any; data: any; }):Promise<any> {
        let searchedUsers = await this.peopleService.getUsers(action.data.PeopleSearchInput);

        return {
            searchedUsers
        }
    }

}