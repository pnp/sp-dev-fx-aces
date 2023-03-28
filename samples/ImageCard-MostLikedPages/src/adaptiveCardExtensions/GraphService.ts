import { MSGraphClientV3 } from "@microsoft/sp-http";
import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { IPropertyFieldSite } from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";
import { GraphPages } from './types';

export interface IGraphService {
  GetPages(site: IPropertyFieldSite): Promise<GraphPages>;
}

class GraphService implements IGraphService {
  public context: AdaptiveCardExtensionContext = null;
  private graphClient: MSGraphClientV3;

  public async GetPages(site: IPropertyFieldSite): Promise<GraphPages> {
    const pages: GraphPages = await this.GET("sites/" + site.id + "/pages", "", "reactions,title,webUrl,thumbnailWebUrl", 50);
    pages.value = pages.value.filter(p => p.reactions.likeCount > 0)
    pages.value.map(p => p.webTitle = site.title)
    pages.value.map(p => p.webUrl = site.url + "/" + p.webUrl)
    return pages;
  }

  private GET(api: string, filter?: string, select?: string, top?: number, responseType?: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      return this.getClient().then((client: MSGraphClientV3): void => {
        client.api(api).version("beta").select(select).filter(filter).responseType(responseType)
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