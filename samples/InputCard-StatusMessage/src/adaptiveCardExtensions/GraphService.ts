import { MSGraphClientV3 } from "@microsoft/sp-http";
import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { PresenceStatusMessage } from "./types";

export interface IGraphService {
    _updateStatusMessage(message: PresenceStatusMessage): Promise<void>;
    _getStatusMessage():  Promise<string>;
}

export class GraphService implements IGraphService {
    public Context: AdaptiveCardExtensionContext;
    private MSGraphClient: MSGraphClientV3;

    constructor(Context: AdaptiveCardExtensionContext) {
        this.Context = Context;
    }

    private async _getClient(): Promise<MSGraphClientV3> {
        if (this.MSGraphClient === undefined)
            this.MSGraphClient = await this.Context.msGraphClientFactory.getClient("3");
        return this.MSGraphClient;
    }

    public async _updateStatusMessage(message: PresenceStatusMessage): Promise<void> {
        const client = await this._getClient();
        await client.api("/me/presence/setStatusMessage").post(message);
    }

    public async _getStatusMessage(): Promise<string> {
        const client = await this._getClient();
        const presence = await client.api("/me/presence").get();
        if (presence.statusMessage !== null){
            return presence.statusMessage.message.content;
        } else {
            return "";
        }
        
    }
}