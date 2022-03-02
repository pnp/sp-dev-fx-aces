import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
import { SPHttpClient } from '@microsoft/sp-http';
import { checkinListApi, checkinLocationOptionApi } from "../common/Constants";

export class HybridWorkCheckinListService {
    public _context: AdaptiveCardExtensionContext;
    /**
     *
     */
    constructor(context: AdaptiveCardExtensionContext) {

        this._context = context;
    }

    public addCheckin = (checkinData: any): Promise<any> => {
        const spHttpClientOption = {
            body: JSON.stringify(checkinData),
            headers: {
                'accept': 'application/json;odata.metadata=none'
            }
        };

        return this._context.spHttpClient
            .post(`${this._context.pageContext.web.absoluteUrl}${checkinListApi}`,
                SPHttpClient.configurations.v1,
                spHttpClientOption
            )
            .then(response => response.json())
            .then(createdResult => {
                return createdResult;
            })
            .catch(error => console.error(error));
    }

    public getWorkLocationOptions = (): Promise<any> => {
        return this._context.spHttpClient
            .get(`${this._context.pageContext.web.absoluteUrl}${checkinLocationOptionApi}`,
                SPHttpClient.configurations.v1
            )
            .then(result => result.json())
            .catch(error => console.log(error));
    }

}