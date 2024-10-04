import { MSGraphClientV3 } from "@microsoft/sp-http";
import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { GraphFiles } from './types';


export interface IFileService {
  _getFiles(siteAddress: string, listTitle: string): Promise<GraphFiles>;
}

export class FileService implements IFileService {
  public context: AdaptiveCardExtensionContext;
  private MSGraphClient: MSGraphClientV3;

  constructor(context: AdaptiveCardExtensionContext) {
    this.context = context;
  }

  public async _getFiles(siteAddress: string, listTitle: string): Promise<GraphFiles> {
    let files: GraphFiles;
    try{
      const client = await this._getClient();
      const siteId = await this._getSiteId(client, siteAddress);
      const listId = await this._getListId(client, siteId, listTitle);
      files = await client.api("sites/"+siteId+"/lists/"+listId+"/items").select("contentType").version('beta').get();
    } catch{
      files = {value:[]};
    }
    return files;
  }

  private async _getSiteId (client:MSGraphClientV3, siteAddress: string): Promise<string> {
    const hostname = siteAddress.split('/')[2];
    const serverRelativeUrl = siteAddress.split(hostname)[1];
    const siteId = await client.api("sites/"+hostname+":"+serverRelativeUrl).version('beta').get();
    return siteId.id;
  }

  private async _getListId (client:MSGraphClientV3, siteId: string, listTitle: string): Promise<string> {
    const list = await client.api("sites/"+siteId+"/lists").version('beta').filter("displayName eq '"+listTitle+"'").get();
    return list.value[0].id;
  }

  private async _getClient(): Promise<MSGraphClientV3> {
    if (this.MSGraphClient === undefined)
      this.MSGraphClient = await this.context.msGraphClientFactory.getClient("3");
    return this.MSGraphClient;
  }
}