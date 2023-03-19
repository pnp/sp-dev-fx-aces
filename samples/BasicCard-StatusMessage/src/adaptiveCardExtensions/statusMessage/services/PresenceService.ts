import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { IStatusMessage } from "../models/IStatusMessage";
import { IPresenceService } from "./IPresenceService";
import { MSGraphClientFactory, MSGraphClientV3 } from '@microsoft/sp-http';
import { IPresenceStatus } from "../models/IPresenceStatus";

const StatusMessageService_ServiceKey = "yhabersaat:StatusMessageService";

export class StatusMessageService implements IPresenceService {
    public static readonly ServiceKey: ServiceKey<IPresenceService> = ServiceKey.create<IPresenceService>(StatusMessageService_ServiceKey, StatusMessageService);
    private _msGraphClientFactory: MSGraphClientFactory;

    public constructor(serviceScope: ServiceScope) {
        serviceScope.whenFinished(() => {
            this._msGraphClientFactory = serviceScope.consume(MSGraphClientFactory.serviceKey);
        })
    }

    public async getCurrentUserStatusMessage(): Promise<IStatusMessage> {
        const endpoint = "/me/presence";
        const msGraphClient: MSGraphClientV3 = await this._msGraphClientFactory.getClient("3");
        const response = await msGraphClient
            .api(endpoint)
            .version("beta")
            .get();

        return response;
    }

    public async setCurrentUserStatusMessage(statusMessage: string, expiration: string): Promise<void> {
        const endpoint = "/me/presence/setStatusMessage";
        let expirationDate: Date = new Date();
        switch (expiration) {
            case "never":
                expirationDate = new Date("9999-12-30T23:00:00.0000000") // This means no expiration date
                break;
            case "PT1H":
                this._addHours(expirationDate, 1)
                break;
            case "PT4H":
                this._addHours(expirationDate, 4)
                break;
            default:
                expirationDate = new Date("9999-12-30T23:00:00.0000000");
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
        const msGraphClient: MSGraphClientV3 = await this._msGraphClientFactory.getClient("3");

        return await msGraphClient
            .api(endpoint)
            .version("beta")
            .post(reqBody);
    }

    public async getCurrentUserId(): Promise<string> {
        const endpoint = "/me";
        const msGraphClient: MSGraphClientV3 = await this._msGraphClientFactory.getClient("3");
        const response = await msGraphClient
            .api(endpoint)
            .version("v1.0")
            .select("id")
            .get();

        return response.id;
    }

    public async setCurrentUserAvailability(userId: string, presence: IPresenceStatus): Promise<void> {
        const endpoint = "/users/" + userId + "/presence/setPresence";
        const reqBody: IPresenceStatus = {
            "sessionId": presence.sessionId,
            "availability": presence.availability,
            "activity": presence.activity,
            "expirationDuration": presence.expirationDuration
        };
        const msGraphClient: MSGraphClientV3 = await this._msGraphClientFactory.getClient("3");

        return await msGraphClient
            .api(endpoint)
            .version("beta")
            .post(reqBody);
    }

    public async getCurrentSessionId(): Promise<string> {
        const endpoint = "/applications";
        const msGraphClient: MSGraphClientV3 = await this._msGraphClientFactory.getClient("3");
        const response = await msGraphClient
            .api(endpoint)
            .version("v1.0")
            .filter("startswith(displayName, 'SharePoint Online Client Extensibility Web Application Principal')")
            .top(1)
            .select("appId")
            .get();

        return response.value[0].appId;
    }

    public async clearPresence(userId: string, sessionId: string): Promise<void> {
        const endpoint = "/users/" + userId + "/presence/clearPresence";
        const reqBody = {
            "sessionId": sessionId,
        };
        const msGraphClient: MSGraphClientV3 = await this._msGraphClientFactory.getClient("3");

        return await msGraphClient
            .api(endpoint)
            .version("beta")
            .post(reqBody);
    }

    private _addHours(date: Date, hours: number): Date {
        date.setHours(date.getHours() + hours);

        return date;
    }
}