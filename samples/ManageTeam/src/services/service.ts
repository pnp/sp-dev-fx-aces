import { IConfig, IMyTeam, Config } from "../models/models";
import { Logger, LogLevel } from "@pnp/logging";
import "@pnp/graph/users";
import "@pnp/graph/onedrive";
import "@pnp/graph/groups";
import { MSGraphClient } from "@microsoft/sp-http";
import { graph } from "@pnp/graph";
import forEach from "lodash/forEach";

export interface IService {
    Init(client: MSGraphClient): Promise<void>;
}

export class Service implements IService {

    private LOG_SOURCE: string = "🔶Service";
    private _ready: boolean = false;
    private _currentConfig: IConfig = null;
    private _client: MSGraphClient;
    public async Init(client: MSGraphClient): Promise<void> {
        this._client = client;
        await this._getConfig();
    }

    public async BlockSignIn(userPrincipalName): Promise<boolean> {
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
        let mmpConfig: IConfig = null;
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
            let directReports = await graph.me.directReports();
            if (directReports.length > 0) {
                forEach(directReports, (o: any) => {
                    returnValue.push({
                        displayName: o.displayName,
                        id: o.id,
                        jobTitle: o.jobTitle,
                        givenName: o.givenName,
                        mail: o.mail,
                        mobilePhone: o.mobilePhone,
                        officeLocation: o.officeLocation,
                        preferredLanguage: o.preferredLanguage,
                        surname: o.surname,
                        userPrincipalName: o.userPrincipalName
                    });
                });
            }
        } catch (error) {
            Logger.write(`${this.LOG_SOURCE} (_directReportsToMe) - ${error} - `, LogLevel.Error);
        }
        return returnValue;
    }

    private async _blockSignIn(userPrincipalName): Promise<boolean> {
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