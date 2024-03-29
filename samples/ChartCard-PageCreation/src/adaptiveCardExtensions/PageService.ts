import { MSGraphClientV3 } from "@microsoft/sp-http";
import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { GraphPages } from './types';

export interface IPageService {
  _getPages(): Promise<GraphPages>;
}

export class PageService implements IPageService {

  public context: AdaptiveCardExtensionContext;
  private MSGraphClient: MSGraphClientV3;

  constructor(context: AdaptiveCardExtensionContext) {
    this.context = context;
}

  public async _getPages(): Promise<GraphPages> {
    const client = await this._getClient();
    const pages: GraphPages = await client.api("sites/"+this.context.pageContext.site.id+"/pages/microsoft.graph.sitePage").select("createdDateTime, promotionKind").version('beta').get();
    return pages;
  }


  private async _getClient(): Promise<MSGraphClientV3> {
    if (this.MSGraphClient === undefined)
        this.MSGraphClient = await this.context.msGraphClientFactory.getClient("3");
    return this.MSGraphClient;
} 
}