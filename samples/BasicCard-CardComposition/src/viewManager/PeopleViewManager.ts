import { people } from "@microsoft/teams-js";
import { PeopleService } from "../service/PeopleService";
import { ChatHandler } from "./actionHandlers/ChatHandler";
import { IActionHandler } from "./actionHandlers/IActionHandler";
import { SearchUsersAction } from "./actionHandlers/SearchUsersAction";
import { VideoCallHandler } from "./actionHandlers/VideoCallHandler";

export class PeopleViewManager{
    protected actionHandlers: IActionHandler[];
    constructor(private peopleService: PeopleService){
        this.actionHandlers = [new ChatHandler(), new VideoCallHandler(), new SearchUsersAction(peopleService)];
    }
    public async getUsers(searchText?: string): Promise<any> {
        let users = await this.peopleService.getUsers(searchText);
        return users;
    }
    public handleAction(action: {id, data: any}){
        let actionHandler = this.actionHandlers.filter(handler => handler.shouldHandleAction(action.id))[0];
        if(actionHandler){
            return actionHandler.handleAction(action);
        }
    }
}