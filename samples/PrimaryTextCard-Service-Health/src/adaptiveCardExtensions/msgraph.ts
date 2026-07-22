import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { MSGraphClientV3 } from '@microsoft/sp-http';

export class MSGraph {
    private static _graphClient: MSGraphClientV3;
    public static async Init(context: AdaptiveCardExtensionContext) {
        this._graphClient = await context.msGraphClientFactory.getClient('3');
    }

    public static async Get(apiUrl: string, version: string = "v1.0", selectProperties?: string[], expandProperties?: string[], filter?: string, count?: boolean): Promise<any> {
        const p = new Promise<string>((resolve, reject) => {
            let query = this._graphClient.api(apiUrl).version(version);
            if (selectProperties && selectProperties.length > 0) {
                query = query.select(selectProperties);
            }
            if (filter && filter.length > 0) {
                query = query.filter(filter);
            }
            if (expandProperties && expandProperties.length > 0) {
                query = query.expand(expandProperties);
            }
            if(count) {
                query = query.count(true);
            }
            
            let callback = (error: any, response: any, rawResponse?: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            };
            void query.get(callback);
        });
        return p;
    }

    public static async Patch(apiUrl: string, version: string = "v1.0", content: any): Promise<any> {
        const p = new Promise<string>((resolve, reject) => {
            if (typeof (content) === "object") {
                content = JSON.stringify(content);
            }

            let query = this._graphClient.api(apiUrl).version(version);
            let callback = (error: any, _response: any, rawResponse?: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(_response);
                }
            };
            void query.update(content, callback);
        });
        return p;
    }

    public static async Post(apiUrl: string, version: string = "v1.0", content: any): Promise<any> {
        const p = new Promise<string>((resolve, reject) => {
            if (typeof (content) === "object") {
                content = JSON.stringify(content);
            }

            let query = this._graphClient.api(apiUrl).version(version);
            let callback = (error: any, response: any, rawResponse?: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            };
            void query.post(content, callback);
        });
        return p;
    }

    public static async Delete(apiUrl: string, version: string = "v1.0"): Promise<any> {
        const p = new Promise<string>((resolve, reject) => {
            let query = this._graphClient.api(apiUrl).version(version);
            let callback = (error: any, response: any, rawResponse?: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            };
            void query.delete(callback);
        });
        return p;
    }
}