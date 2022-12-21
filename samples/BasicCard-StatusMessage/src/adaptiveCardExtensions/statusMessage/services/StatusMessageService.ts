import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { IStatusMessage } from "../models/IStatusMessage";
import { IStatusMessageService } from "./IStatusMessageService";
import { MSGraphClientFactory, MSGraphClientV3 } from '@microsoft/sp-http';

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
        const endpoint = "https://graph.microsoft.com/beta/me/presence";
        const msGraphClient: MSGraphClientV3 = await this._msGraphClientFactory.getClient("3");
        const response = await msGraphClient
            .api(endpoint)
            .get();
        return response;
    }

    public async setCurrentUserStatusMessage(statusMessage: string): Promise<void> {
        const endpoint = "https://graph.microsoft.com/beta/me/presence/setStatusMessage";
        const reqBody: IStatusMessage = {
            "statusMessage": {
                "message": {
                    "content": `${statusMessage}`,
                    "contentType": "text"
                }
            }
        };
        const msGraphClient: MSGraphClientV3 = await this._msGraphClientFactory.getClient("3");
        return await msGraphClient
            .api(endpoint)
            .post(reqBody);
    }
}