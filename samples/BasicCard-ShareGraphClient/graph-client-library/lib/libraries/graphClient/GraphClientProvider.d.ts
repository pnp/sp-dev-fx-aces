import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { AadHttpClientFactory } from "@microsoft/sp-http";
import { IHttpClient } from "mgwdev-m365-helpers/lib/dal/http/IHttpClient";
export declare class GraphClientProvider {
    protected serviceScope: ServiceScope;
    static readonly serviceKey: ServiceKey<GraphClientProvider>;
    protected clientFactory: AadHttpClientFactory;
    protected client: IHttpClient;
    constructor(serviceScope: ServiceScope);
    getGraphClient(): Promise<IHttpClient>;
}
//# sourceMappingURL=GraphClientProvider.d.ts.map