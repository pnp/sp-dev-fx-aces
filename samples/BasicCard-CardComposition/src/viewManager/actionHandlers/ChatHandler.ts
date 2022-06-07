import { IActionHandler } from "./IActionHandler";
import * as teamsJs from "@microsoft/teams-js";

export class ChatHandler implements IActionHandler {
    constructor() {
        teamsJs.app.initialize();
    }
    public shouldHandleAction(actionId: string): boolean {
        return actionId.indexOf("chat-") > -1;
    }
    public handleAction(action: { id: any; data: any; }): Promise<any> {
        let chatUrl = `https://teams.microsoft.com/l/chat/0/0?users=${[action.data.loginName].join(";")}`;
        if(window.parent === window){
            window.open(chatUrl, "_blank");
        }
        return teamsJs.app.openLink(chatUrl);
    }
}