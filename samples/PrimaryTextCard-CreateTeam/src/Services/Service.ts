import { Logger, LogLevel } from "@pnp/logging";
import { ITeamProperties } from "../Models/ITeamProperties";
import { MSGraphClientV3 } from "@microsoft/sp-http";

export interface IService {
    Init(client: MSGraphClientV3): Promise<void>;
}

export class Service implements IService {
    private LOG_SOURCE: string = "🔶Service";
    private _ready: boolean = false;
    private _client: MSGraphClientV3;
    private _currentUserId: string;

    public async Init(client: MSGraphClientV3): Promise<void> {
        this._client = client;
        try {
            await this._getUser();
            this._ready = true;
        } catch (error) {
            this._ready = false;
            Logger.write(`${this.LOG_SOURCE} (Init) - ${error} - `, LogLevel.Error);
        }
    }

    public get Ready(): boolean {
        return this._ready;
    }

    private async _getUser(): Promise<void> {
        try {
            const user = await this._client.api("/me").get();
            this._currentUserId = user.id;
        } catch (error) {
            Logger.write(`${this.LOG_SOURCE} (_getUser) - ${error} - `, LogLevel.Error);
            throw error;
        }
    }

    public async CreateTeam(teamProps: ITeamProperties): Promise<boolean> {
        if (!this.Ready) {
            Logger.write(`${this.LOG_SOURCE} (CreateTeam) - Service not initialized. - `, LogLevel.Error);
            return false;
        }
        return await this._CreateTeam(teamProps);
    }

    private async _CreateTeam(teamProps: ITeamProperties): Promise<boolean> {
        const team = {
            "template@odata.bind": `https://graph.microsoft.com/v1.0/teamsTemplates('${teamProps.templateType}')`,
            "displayName": teamProps.displayName,
            "description": teamProps.description,
            "teamType": teamProps.type,
            "members": [
                {
                    "@odata.type": "#microsoft.graph.aadUserConversationMember",
                    "roles": ["owner"],
                    "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${this._currentUserId}')`
                }
            ]
        };

        try {
            await this._client.api("/teams").post(team);
            Logger.write(`${this.LOG_SOURCE} (_CreateTeam) - Team created. - `, LogLevel.Info);
            return true;
        } catch (error) {
            Logger.write(`${this.LOG_SOURCE} (_CreateTeam) - ${error}. - `, LogLevel.Error);
            return false;
        }
    }
}