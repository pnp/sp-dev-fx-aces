import { IActionHandler } from "./IActionHandler";
import * as teamsJs from "@microsoft/teams-js";

export class VideoCallHandler implements IActionHandler {
    constructor() {
        teamsJs.app.initialize();
    }
    public shouldHandleAction(actionId: string): boolean {
        return actionId.indexOf("call-") > -1;
    }
    public handleAction(action: { id: any; data: any; }): Promise<any> {
        let chatUrl = `https://teams.microsoft.com/l/call/0/0?users=${[action.data.loginName].join(";")}&withvideo=true`;
        if(window.parent === window){
            window.open(chatUrl, "_blank");
        }
        return teamsJs.app.openLink(chatUrl);
    }
}