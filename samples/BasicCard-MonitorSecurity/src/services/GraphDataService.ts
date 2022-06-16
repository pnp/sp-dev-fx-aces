import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { MSGraphClient, AadHttpClient } from "@microsoft/sp-http";

export class GraphDataService {
    private _context: AdaptiveCardExtensionContext;

    public setContext(ctx: AdaptiveCardExtensionContext) {
        this._context = ctx;
    }

    public getSecurityDataCounts(): Promise<any> {
        const graphQueryUrl = `/security/alerts/$count`;
        return this._context.msGraphClientFactory.getClient()
            .then((graphClient: MSGraphClient) => {
                return graphClient
                    .api(graphQueryUrl)
                    .get()
                    .then(result => result)
                    .catch(err => console.log(err));
            });
    }

    public getRiskyUserData(query: string): Promise<any> {
        const graphQueryUrl = `/identityProtection/riskyUsers?$count=true${query}`;
        return this._context.msGraphClientFactory.getClient()
            .then((graphClient: MSGraphClient) => {
                return graphClient
                    .api(graphQueryUrl)
                    .get()
                    .then(result => result)
                    .catch(err => console.log(err));
            });
    }

    public getIdentityRiskData(query: string): Promise<any> {
        const graphQueryUrl = `/identityProtection/riskDetections?$count=true${query}`;
        return this._context.msGraphClientFactory.getClient()
            .then((graphClient: MSGraphClient) => {
                return graphClient
                    .api(graphQueryUrl)
                    .get()
                    .then(result => result)
                    .catch(err => console.log(err));
            });
    }

}

export const graphService = new GraphDataService();