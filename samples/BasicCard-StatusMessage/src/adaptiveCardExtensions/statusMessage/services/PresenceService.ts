import { Log, ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { IStatusMessage } from "../models/IStatusMessage";
import { IPresenceService } from "./IPresenceService";
import { MSGraphClientFactory, MSGraphClientV3 } from '@microsoft/sp-http';
import { IPresenceStatus } from "../models/IPresenceStatus";

const PresenceService_ServiceKey = "BasicCard-StatusMessage:PresenceService";
const PresenceServiceLogSource = "PresenceService";
const NoExpirationDateString = "9999-12-30T23:00:00.0000000Z"; // This means no expiration datetime for a status message

export class StatusMessageService implements IPresenceService {

    public static readonly ServiceKey: ServiceKey<IPresenceService> = ServiceKey.create<IPresenceService>(PresenceService_ServiceKey, StatusMessageService);

    private _serviceScope: ServiceScope;
    private _msGraphClientFactory: MSGraphClientFactory;

    public constructor(serviceScope: ServiceScope) {
        serviceScope.whenFinished(async () => {
            this._msGraphClientFactory = serviceScope.consume(MSGraphClientFactory.serviceKey);
        });
    }

    public async getCurrentUserStatusMessage(): Promise<IStatusMessage> {

        const endpoint = "/me/presence";

        try {
            const msGraphClient: MSGraphClientV3 = await this._msGraphClientFactory.getClient("3");
            const response = await msGraphClient
                .api(endpoint)
                .version("beta")
                .get();

            return response;

        } catch (error) {
            Log.warn(PresenceServiceLogSource, `Unable to retrieve current user presence information. Details: ${error.message ? error.message : error}`, this._serviceScope);
            return null;
        }
    }

    public async setCurrentUserStatusMessage(statusMessage: string, expiration: string): Promise<void> {

        const endpoint = "/me/presence/setStatusMessage";
        let expirationDate: Date = new Date();

        switch (expiration) {
            case "never":
                expirationDate = new Date(NoExpirationDateString);
                break;
            case "PT1H":
                this._addHours(expirationDate, 1)
                break;
            case "PT4H":
                this._addHours(expirationDate, 4)
                break;
            default:
                expirationDate = new Date(NoExpirationDateString);
                break;
        }

        const reqBody: IStatusMessage = {
            "statusMessage": {
                "message": {
                    "content": statusMessage,
                    "contentType": "text"
                },
                "expiryDateTime": {
                    "dateTime": expirationDate.toISOString(),
                    "timeZone": "UTC"
                }
            }
        };

        try {
            const msGraphClient: MSGraphClientV3 = await this._msGraphClientFactory.getClient("3");

            return await msGraphClient
                .api(endpoint)
                .version("beta")
                .post(reqBody);

        } catch (error) {
            Log.warn(PresenceServiceLogSource, `Unable to set current user status message. Details: ${error.message ? error.message : error}`, this._serviceScope);
            return error;
        }
    }

    public async getCurrentUserId(): Promise<string> {

        const endpoint = "/me";

        try {
            const msGraphClient: MSGraphClientV3 = await this._msGraphClientFactory.getClient("3");
            const response = await msGraphClient
                .api(endpoint)
                .version("v1.0")
                .select("id")
                .get();

            return response.id;

        } catch (error) {
            Log.warn(PresenceServiceLogSource, `Unable to get current user ID. Details: ${error.message ? error.message : error}`, this._serviceScope);
            return null;
        }
    }

    public async setCurrentUserAvailability(userId: string, presence: IPresenceStatus): Promise<void> {

        const endpoint = "/users/" + userId + "/presence/setPresence";

        const reqBody: IPresenceStatus = {
            "sessionId": presence.sessionId,
            "availability": presence.availability,
            "activity": presence.activity,
            "expirationDuration": presence.expirationDuration
        };

        try {
            const msGraphClient: MSGraphClientV3 = await this._msGraphClientFactory.getClient("3");

            return await msGraphClient
                .api(endpoint)
                .version("beta")
                .post(reqBody);

        } catch (error) {
            Log.warn(PresenceServiceLogSource, `Unable to set current user availability. Details: ${error.message ? error.message : error}`, this._serviceScope);
            return error;
        }
    }

    public async getCurrentSessionId(): Promise<string> {

        const endpoint = "/applications";

        try {
            const msGraphClient: MSGraphClientV3 = await this._msGraphClientFactory.getClient("3");
            const response = await msGraphClient
                .api(endpoint)
                .version("v1.0")
                .filter("startswith(displayName, 'SharePoint Online Client Extensibility Web Application Principal')")
                .top(1)
                .select("appId")
                .get();

            return response.value[0].appId;

        } catch (error) {
            Log.warn(PresenceServiceLogSource, `Unable to get current session ID. Details: ${error.message ? error.message : error}`, this._serviceScope);
            return null;
        }
    }

    public async clearPresence(userId: string, sessionId: string): Promise<void> {

        const endpoint = "/users/" + userId + "/presence/clearPresence";

        const reqBody = {
            "sessionId": sessionId,
        };

        try {
            const msGraphClient: MSGraphClientV3 = await this._msGraphClientFactory.getClient("3");

            return await msGraphClient
                .api(endpoint)
                .version("beta")
                .post(reqBody);

        } catch (error) {
            Log.warn(PresenceServiceLogSource, `Unable to clear current user presence. Details: ${error.message ? error.message : error}`, this._serviceScope);
            return error;
        }
    }

    private _addHours(date: Date, hours: number): Date {
        date.setHours(date.getHours() + hours);
        return date;
    }
}