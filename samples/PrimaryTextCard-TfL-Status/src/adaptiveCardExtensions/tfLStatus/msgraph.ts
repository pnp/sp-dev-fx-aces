import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { GraphError } from '@microsoft/microsoft-graph-client';
import { MSGraphClientV3 } from '@microsoft/sp-http';

export class MSGraph {
    private static _graphClient: MSGraphClientV3;
    public static async Init(context: AdaptiveCardExtensionContext): Promise<void> {
        this._graphClient = await context.msGraphClientFactory.getClient('3')
    }

    public static async Get<T = unknown>(apiUrl: string, version: string = "v1.0", selectProperties?: string[], expandProperties?: string[], filter?: string): Promise<T> {
        const p = new Promise<T>(async (resolve, reject) => {
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

            const callback = (error: GraphError, response: T, rawResponse?: unknown): void => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            };
            await query.get(callback);
        });
        return p;
    }

    public static async Patch<T = unknown>(apiUrl: string, version: string = "v1.0", content: unknown): Promise<T> {
        const p = new Promise<T>(async (resolve, reject) => {
            if (typeof (content) === "object") {
                content = JSON.stringify(content);
            }

            const query = this._graphClient.api(apiUrl).version(version);
            const callback = (error: GraphError, _response: T, rawResponse?: unknown): void => {
                if (error) {
                    reject(error);
                } else {
                    resolve(_response);
                }
            };
            await query.update(content, callback);
        });
        return p;
    }

    public static async Post<T = unknown>(apiUrl: string, version: string = "v1.0", content: unknown): Promise<T> {
        const p = new Promise<T>(async (resolve, reject) => {
            if (typeof (content) === "object") {
                content = JSON.stringify(content);
            }

            const query = this._graphClient.api(apiUrl).version(version);
            const callback = (error: GraphError, response: T, rawResponse?: unknown): void => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            };
            await query.post(content, callback);
        });
        return p;
    }

    public static async Delete<T = unknown>(apiUrl: string, version: string = "v1.0"): Promise<T> {
        const p = new Promise<T>(async (resolve, reject) => {
            const query = this._graphClient.api(apiUrl).version(version);
            const callback = (error: GraphError, response: T, rawResponse?: unknown): void => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            };
            await query.delete(callback);
        });
        return p;
    }
}