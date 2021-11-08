import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
import { SPHttpClient } from '@microsoft/sp-http';

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
            .post(`${this._context.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('Hybrid Work Employee Check in')/items`,
                SPHttpClient.configurations.v1,
                spHttpClientOption
            )
            .then(response => response.json())
            .then(createdResult => {
                return createdResult;
            })
            .catch(error => console.error(error));
    }

}