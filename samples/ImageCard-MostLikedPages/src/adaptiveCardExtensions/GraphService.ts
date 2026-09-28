import { MSGraphClientV3 } from "@microsoft/sp-http";
import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { IPropertyFieldSite } from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";
import { GraphPages } from './types';

export interface IGraphService {
  GetPages(site: IPropertyFieldSite): Promise<GraphPages>;
  GetSites(): Promise<IPropertyFieldSite[]>;
}

class GraphService implements IGraphService {
  public context!: AdaptiveCardExtensionContext;
  private graphClient: MSGraphClientV3;

  public async GetPages(site: IPropertyFieldSite): Promise<GraphPages> {
    const pages: GraphPages = await this.GET("sites/" + site.id + "/pages/microsoft.graph.sitePage", "", "reactions,title,webUrl,thumbnailWebUrl", 50);
    pages.value = pages.value.filter(p => p.reactions.likeCount > 0)
    pages.value.forEach(p => { p.webTitle = site.title; });
    pages.value.forEach(p => { p.webUrl = site.url + "/" + p.webUrl; });
    return pages;
  }

  public async GetSites(): Promise<IPropertyFieldSite[]> {
    try {
      const client: MSGraphClientV3 = await this.getClient();
      const response: { value: { id: string; displayName?: string; name?: string; webUrl: string }[] } =
        await client
          .api("sites")
          .version("v1.0")
          .query({ search: "*" })
          .select("id,displayName,name,webUrl")
          .top(50)
          .get();

      return (response.value ?? []).map((s) => ({
        id: s.id,
        url: s.webUrl,
        title: s.displayName ?? s.name ?? s.webUrl
      }));
    } catch (error) {
      console.error("Error retrieving sites", error);
      return [];
    }
  }

  private GET(api: string, filter?: string, select?: string, top?: number, responseType?: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      return this.getClient().then((client: MSGraphClientV3): void => {
        void client.api(api).version("beta").select(select ?? "").filter(filter ?? "").responseType(responseType)
          .get((error: any, response: any) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(response);
          });
      });
    });
  }

  private getClient(): Promise<MSGraphClientV3> {
    if (!this.graphClient) {
      return this.context.msGraphClientFactory
        .getClient("3")
        .then((client: MSGraphClientV3) => {
          this.graphClient = client;
          return client;
        })
        .catch((error: Error) => {
          console.error('Error getting the Graph client', error);
          throw error;
        });
    }
    else {
      return Promise.resolve(this.graphClient);
    }
  }
}


export const GraphServiceInstance = new GraphService();