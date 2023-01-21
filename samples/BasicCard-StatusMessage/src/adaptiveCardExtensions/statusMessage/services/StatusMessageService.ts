import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { IStatusMessage } from "../models/IStatusMessage";
import { IStatusMessageService } from "./IStatusMessageService";
import { MSGraphClientFactory, MSGraphClientV3 } from '@microsoft/sp-http';
import { IPresenceStatus } from "../models/IPresenceStatus";

const StatusMessageService_ServiceKey = "yhabersaat:StatusMessageService";

export class StatusMessageService implements IStatusMessageService {
    public static readonly ServiceKey: ServiceKey<IStatusMessageService> = ServiceKey.create<IStatusMessageService>(StatusMessageService_ServiceKey, StatusMessageService);
    private _msGraphClientFactory: MSGraphClientFactory;

    public constructor(serviceScope: ServiceScope) {
        serviceScope.whenFinished(() => {
            this._msGraphClientFactory = serviceScope.consume(MSGraphClientFactory.serviceKey);
        })
    }

    public async getCurrentUserStatusMessage(): Promise<IStatusMessage> {
        const endpoint = "me/presence";
        const msGraphClient: MSGraphClientV3 = await this._msGraphClientFactory.getClient("3");
        const response = await msGraphClient
            .api(endpoint)
            .version("beta")
            .get();
        return response;
    }

    public async setCurrentUserStatusMessage(statusMessage: string): Promise<void> {
        const endpoint = "me/presence/setStatusMessage";
        const reqBody: IStatusMessage = {
            "statusMessage": {
                "message": {
                    "content": `${statusMessage}`,
                    "contentType": "text"
                },
                "expiryDateTime": {
                    "dateTime": "9999-12-30T23:00:00.0000000",
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
        const endpoint = "me";
        const msGraphClient: MSGraphClientV3 = await this._msGraphClientFactory.getClient("3");
        const response = await msGraphClient
            .api(endpoint)
            .version("v1.0")
            .select("id")
            .get();
        return response.id;
    }

    public async setCurrentUserAvailability(userId: string, sessionId: string, availability: string, activity: string): Promise<void> {
        const endpoint = "users/" + userId + "/presence/setPresence";
        const reqBody: IPresenceStatus = {
            "sessionId": sessionId,
            "availability": availability,
            "activity": activity
        }
        const msGraphClient: MSGraphClientV3 = await this._msGraphClientFactory.getClient("3");
        return await msGraphClient
            .api(endpoint)
            .version("beta")
            .post(reqBody);
    }

    public async getCurrentSessionId(): Promise<string> {
        const endpoint = "applications";
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
}