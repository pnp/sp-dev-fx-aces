import { IConfig, IMyTeam, Config } from "../models/models";
import { Logger, LogLevel } from "@pnp/logging";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";
import "@pnp/graph/groups";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import { graph } from "@pnp/graph";
import forEach from "lodash/forEach";
import { User } from "@microsoft/microsoft-graph-types";

export interface IService {
    Init(client: MSGraphClientV3): Promise<void>;
}

export class Service implements IService {

    private LOG_SOURCE: string = "🔶Service";
    private _ready: boolean = false;
    private _currentConfig: IConfig = null as unknown as IConfig;
    private _client!: MSGraphClientV3;
    public async Init(client: MSGraphClientV3): Promise<void> {
        this._client = client;
        await this._getConfig();
    }

    public async BlockSignIn(userPrincipalName: string): Promise<boolean> {
        return await this._blockSignIn(userPrincipalName);
    }
    public get Ready(): boolean {
        return this._ready;
    }
    public get Config(): IConfig {
        return this._currentConfig;
    }

    private async _getConfig(): Promise<void> {
        try {
            this._currentConfig = await this.GenerateConfig();
            this._ready = true;
        } catch (error) {
            Logger.write(`${this.LOG_SOURCE} (_getConfig) - ${error} - `, LogLevel.Error);
        }
    }

    private async GenerateConfig(): Promise<IConfig> {
        let mmpConfig: IConfig = null as unknown as IConfig;
        try {
            mmpConfig = new Config();
            mmpConfig.members = await this._directReportsToMe();
        } catch (error) {
            Logger.write(`${this.LOG_SOURCE} (GenerateConfig) - ${error} - `, LogLevel.Error);
        }
        return mmpConfig;
    }

    private async _directReportsToMe(): Promise<IMyTeam[]> {
        let returnValue: IMyTeam[] = [];
        try {
            let directReports = await graph.me.directReports() as User[];
            if (directReports.length > 0) {
                forEach(directReports, (o: User) => {
                    returnValue.push({
                        displayName: o.displayName ?? "",
                        id: o.id ?? "",
                        jobTitle: o.jobTitle ?? "",
                        givenName: o.givenName ?? "",
                        mail: o.mail ?? "",
                        mobilePhone: o.mobilePhone ?? "",
                        officeLocation: o.officeLocation ?? "",
                        preferredLanguage: o.preferredLanguage ?? "",
                        surname: o.surname ?? "",
                        userPrincipalName: o.userPrincipalName ?? ""
                    });
                });
            }
        } catch (error) {
            Logger.write(`${this.LOG_SOURCE} (_directReportsToMe) - ${error} - `, LogLevel.Error);
        }
        return returnValue;
    }

    private async _blockSignIn(userPrincipalName: string): Promise<boolean> {
        let doesSignInBlocked: boolean = false;

        await this._client.api(`/users/${userPrincipalName}`).patch({
            "accountEnabled": false
        }).then(() => {
            doesSignInBlocked = true;
        }).catch((error) => {
            Logger.write(`${this.LOG_SOURCE} (_blockSignIn) - ${error} - `, LogLevel.Error);
        });

        return doesSignInBlocked;
    }
}