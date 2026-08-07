import { Log, ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { IStatusMessage } from "../models/IStatusMessage";
import { IPresenceService } from "./IPresenceService";
import { AadTokenProviderFactory, MSGraphClientFactory, MSGraphClientV3 } from '@microsoft/sp-http';
import { IPresenceStatus } from "../models/IPresenceStatus";

const PresenceService_ServiceKey = "BasicCard-StatusMessage:PresenceService";
const NoExpirationDateString = "9999-12-30T23:00:00.0000000Z"; // This means no expiration datetime for a status message

export class StatusMessageService implements IPresenceService {

    public static readonly ServiceKey: ServiceKey<IPresenceService> = ServiceKey.create<IPresenceService>(PresenceService_ServiceKey, StatusMessageService);

    private _serviceScope: ServiceScope;
    private _msGraphClientFactory: MSGraphClientFactory;
    private _aadTokenProviderFactory: AadTokenProviderFactory;

    public constructor(serviceScope: ServiceScope) {
        serviceScope.whenFinished(async () => {
            this._msGraphClientFactory = serviceScope.consume(MSGraphClientFactory.serviceKey);
            this._aadTokenProviderFactory = serviceScope.consume(AadTokenProviderFactory.serviceKey);
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
            Log.error("[PresenceService.getCurrentUserStatusMessage()]", error, this._serviceScope);
            throw error;
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
            Log.error("[PresenceService.setCurrentUserStatusMessage()]", error, this._serviceScope);
            throw error;
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
            Log.error("[PresenceService.getCurrentUserId()]", error, this._serviceScope);
            throw error;
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
            Log.error("[setCurrentUserAvailability()]", error, this._serviceScope);
            throw error;
        }
    }

    public async getCurrentSessionId(): Promise<string> {

        try {
            const tokenProvider = await this._aadTokenProviderFactory.getTokenProvider();
            const graphToken = await tokenProvider.getToken("https://graph.microsoft.com");

            // setPresence requires sessionId to equal the calling app's id, held in the token's 'appid' claim.
            return this._decodeJwtPayload(graphToken).appid;

        } catch (error) {
            Log.error("[getCurrentSessionId()]", error, this._serviceScope);
            throw error;
        }
    }

    private _decodeJwtPayload(token: string): { appid: string } {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        ));
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
            Log.error("[clearPresence()]", error, this._serviceScope);
            throw error;
        }
    }

    private _addHours(date: Date, hours: number): Date {
        date.setHours(date.getHours() + hours);
        return date;
    }
}