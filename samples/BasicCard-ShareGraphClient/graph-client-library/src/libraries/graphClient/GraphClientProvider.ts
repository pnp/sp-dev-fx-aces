import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { AadHttpClientFactory } from "@microsoft/sp-http";
import { SPFxGraphHttpClient } from "mgwdev-m365-helpers/lib/dal/http/SPFxGraphHttpClient"
import { BatchGraphClient } from "mgwdev-m365-helpers/lib/dal/http/BatchGraphClient"
import { IHttpClient } from "mgwdev-m365-helpers/lib/dal/http/IHttpClient";

export class GraphClientProvider{
    public static readonly serviceKey: ServiceKey<GraphClientProvider> = ServiceKey.create<GraphClientProvider>("pnp-sample:GraphClientProvider", GraphClientProvider); 
    protected clientFactory: AadHttpClientFactory;
    protected client: IHttpClient;
    constructor(protected serviceScope: ServiceScope){
        serviceScope.whenFinished(()=>this.clientFactory = serviceScope.consume(AadHttpClientFactory.serviceKey))
    }
    public async getGraphClient(): Promise<IHttpClient>{
        if(!this.client){
            let spfxGraphClient = await this.clientFactory.getClient("https://graph.microsoft.com");
            let baseClient = new SPFxGraphHttpClient(spfxGraphClient);
            this.client = new BatchGraphClient(baseClient);
        }
        return this.client;
    }
}