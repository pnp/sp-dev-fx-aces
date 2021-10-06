import { Logger, LogLevel } from "@pnp/logging";
import { ITeamProperties } from "../Models/ITeamProperties";
import "@pnp/graph/users";
import "@pnp/graph/teams"
import { MSGraphClient } from "@microsoft/sp-http";
import { graph } from "@pnp/graph";
import { ITeam } from "@pnp/graph/teams";
export interface IService {
    Init(client: MSGraphClient): Promise<void>;
}
export class Service implements IService {
    private LOG_SOURCE: string = "🔶Service";
    private _ready: boolean = false;
    private _client: MSGraphClient;
    private _currentUserId: string;
    public async Init(client: MSGraphClient): Promise<void> {
        this._client = client;
        await this._getUser().then(() => {
            this._ready = true;
        }).catch((error) => {
            this._ready = false;
        })
    }
    public get Ready(): boolean {
        return this._ready;
    }

    private async _getUser(): Promise<any> {
        await graph.me().then((user) => {
            this._currentUserId = user.id;
        }).catch((error) => {
            Logger.write(`${this.LOG_SOURCE} (_getUser) - ${error} - `, LogLevel.Error);
        });
    }

    public async CreateTeam(teamProps: ITeamProperties): Promise<boolean> {
        if (!this.Ready) {
            Logger.write(`${this.LOG_SOURCE} (CreateTeam) - Service not initialized. - `, LogLevel.Error);
            return;
        }
        return await this._CreateTeam(teamProps);
    }

    private async _CreateTeam(teamProps: ITeamProperties): Promise<boolean> {
        let requestSuccess: boolean = false;
        const team = {
            "template@odata.bind": `https://graph.microsoft.com/v1.0/teamsTemplates('${teamProps.templateType}')`,
            "displayName": teamProps.displayName,
            "description": teamProps.description,
            "teamType": teamProps.type,
            "members": [
                {
                    "@odata.type": "#microsoft.graph.aadUserConversationMember",
                    "roles": ["owner"],
                    "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${this._currentUserId}')`,
                },
            ],
        };
        await graph.teams.create(team).then((team) => {
            Logger.write(`${this.LOG_SOURCE} (_CreateTeam) - Team created. - `, LogLevel.Info);
            requestSuccess = true;
        }).catch((error) => {
            requestSuccess = false;
            Logger.write(`${this.LOG_SOURCE} (_CreateTeam) - ${error}. - `, LogLevel.Error);
        });
        return requestSuccess;
    }
}