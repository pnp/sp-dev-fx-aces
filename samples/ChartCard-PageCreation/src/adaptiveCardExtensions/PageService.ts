import { MSGraphClientV3 } from "@microsoft/sp-http";
import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { GraphPages } from './types';

export interface IPageService {
  _getPages(): Promise<GraphPages>;
}

export class PageService {

  public context: AdaptiveCardExtensionContext;
  private MSGraphClient: MSGraphClientV3;

  constructor(context: AdaptiveCardExtensionContext) {
    this.context = context;
}

  public async _getPages(): Promise<GraphPages> {
    const pages: GraphPages = await this.MSGraphClient.api("sites/"+this.context.pageContext.site.id+"/pages/microsoft.graph.sitePage").select("createdDateTime, promotionKind").get();
    return pages;
  }


   public async _getClient(context: AdaptiveCardExtensionContext): Promise<MSGraphClientV3> {
        if (this.MSGraphClient === undefined)
            this.MSGraphClient = await context.msGraphClientFactory.getClient("3");
        return this.MSGraphClient;
    } 
}