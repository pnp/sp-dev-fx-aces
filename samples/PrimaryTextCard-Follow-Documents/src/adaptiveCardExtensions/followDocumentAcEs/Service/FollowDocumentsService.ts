import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { FollowDocument } from './../models/followDocument';
import Graph from "./GraphService";
import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';

export default class FollowDocumentsService {
  private _context: AdaptiveCardExtensionContext;
  public getFollowDocuments = async (followDocuments: FollowDocument[], context: AdaptiveCardExtensionContext): Promise<any> => {
    this._context = context;
    const graphService: Graph = new Graph();
    let graphData: any = [];
    graphData = await graphService.getGraphContent(`https://graph.microsoft.com/v1.0/me/drive/following?$select=id,name,webUrl,parentReference,followed,size&Top=1000&Filter=size%20ne%200`, this._context);
    if (graphData.value !== undefined) {
      graphData.value.forEach(data => {

        let followDocument: FollowDocument = {
          ItemId: data.id,
          Title: data.name,
          WebFileUrl: data.webUrl,
          DriveId: data.parentReference.driveId,
          followedDateTime: new Date(data.followed.followedDateTime),
        } as FollowDocument;
        this.GetIcon(data.name).then(icon => {
          followDocument.IconUrl = (this._context.pageContext.web.absoluteUrl + "/_layouts/15/images/lg_" + icon).replace("lg_iczip.gif", "lg_iczip.png").replace("lg_icmsg.png", "lg_icmsg.gif");
        });
        followDocuments.push(followDocument);
      });
      followDocuments = await this.getList(followDocuments);
    }
    return followDocuments;
  }

  private getList = async (followDocuments: FollowDocument[]): Promise<any> => {
    let items: FollowDocument[] = [];
    const graphService: Graph = new Graph();
    const initialized = await graphService.initialize(this._context.serviceScope);
    if (initialized) {
      let uniq = {};
      let uniqueArray = [];
      uniqueArray = followDocuments.filter(obj => !uniq[obj.DriveId] && (uniq[obj.DriveId] = true));
      const requests = this.getBatchRequest(uniqueArray, "/me/drives/{driveId}/list?select=id,webUrl,parentReference");
      for (let index = 0; index < requests.length; index++) {
        const graphData: any = await graphService.postGraphContent("https://graph.microsoft.com/v1.0/$batch", requests[index]);
        graphData.responses.forEach((data: any) => {
          followDocuments.forEach((followDocument: FollowDocument) => {
            let driveId: string = decodeURI(data.body["@odata.context"].substring(
              data.body["@odata.context"].indexOf("drives('") + 8,
              data.body["@odata.context"].lastIndexOf("'")
            ));
            if (followDocument.DriveId === driveId && (followDocument.ListId === undefined || followDocument.ListId === "")) {
              followDocument.ListId = data.body.id;
              followDocument.ItemProperties = data.body.webUrl + "/Forms/dispForm.aspx?ID=";
              followDocument.SiteId = data.body.parentReference.siteId;
              items.push(followDocument);
            }
          });
        });

      }
      followDocuments = await this.getDriveItem(items);
      return followDocuments;
    }
  }

  private getDriveItem = async (followDocuments: FollowDocument[]): Promise<any> => {
    const graphService: Graph = new Graph();
    let items: FollowDocument[] = [];
    const initialized = await graphService.initialize(this._context.serviceScope);
    if (initialized) {
      const requests = this.getBatchRequest(followDocuments, "/me/drives/{driveId}/items/{ItemID}?$select=id,content.downloadUrl,ListItem&expand=ListItem(select=id,webUrl),thumbnails(select=large)");
      for (let index = 0; index < requests.length; index++) {
        const graphData: any = await graphService.postGraphContent("https://graph.microsoft.com/v1.0/$batch", requests[index]);
        graphData.responses.forEach((data: any) => {
          followDocuments.forEach((followDocument: FollowDocument) => {

            if (followDocument.ItemId === data.body.id && followDocument.Url === undefined) {
              followDocument.id = data.body.listItem.id;
              followDocument.Url = data.body.listItem.webUrl;
              followDocument.Folder = data.body.listItem.webUrl.substring(0, data.body.listItem.webUrl.lastIndexOf("/") + 1);
              followDocument.ItemProperties = followDocument.ItemProperties + data.body.listItem.id;
              followDocument.DownloadFile = data.body["@microsoft.graph.downloadUrl"];
              followDocument.Thumbnail = data.body.thumbnails.length > 0 ? data.body.thumbnails[0].large.url : "";
              items.push(followDocument);
            }
          });
        });
      }
      followDocuments = await this.getWeb(items);
      return followDocuments;
    }
  }

  private getWeb = async (followDocuments: FollowDocument[]): Promise<any> => {
    const graphService: Graph = new Graph();
    let items: FollowDocument[] = [];
    const initialized = await graphService.initialize(this._context.serviceScope);
    if (initialized) {
      let uniq = {};
      let uniqueArray = [];
      uniqueArray = followDocuments.filter(obj => !uniq[obj.SiteId] && (uniq[obj.SiteId] = true));
      const requests = this.getBatchRequest(uniqueArray, "/sites/{SiteId}?$select=id,siteCollection,webUrl,name,displayName");
      for (let index = 0; index < requests.length; index++) {
        const graphData = await graphService.postGraphContent("https://graph.microsoft.com/v1.0/$batch", requests[index]);
        graphData.responses.forEach((data: any) => {
          followDocuments.forEach((followDocument: FollowDocument) => {
            if (followDocument.SiteId === data.body.id && (followDocument.Domain === undefined || followDocument.Domain === "")) {
              followDocument.Domain = data.body.siteCollection.hostname;
              followDocument.WebUrl = data.body.webUrl;
              followDocument.WebName = (data.body.name !== "" ? data.body.name : data.body.displayName);
              items.push(followDocument);
            }
          });
        });
        return items;
      }
    }

  }

  public GetIcon = async (name: string): Promise<string> => {
    var url = `${this._context.pageContext.web.absoluteUrl}/_api/web/maptoicon(filename='${name}',%20progid='',%20size=0)`;
    const value = await this._context.spHttpClient.get(url, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse): Promise<{
      value: string;
    }> => {
      return response.json();
    })
      .then((item: { value: string }) => {
        return item.value;
      });

    return value;
  }

  public getBatchRequest = (followDocuments: FollowDocument[], graphQuery: string) => {
    let HeaderDriveItemsId = {
      "requests": []
    };
    let count = 1;
    let Items = [];
    followDocuments.forEach((element, index) => {
      if (count < 21) {
        HeaderDriveItemsId.requests.push({
          "url": graphQuery.replace("{driveId}", element.DriveId).replace("{ItemID}", element.ItemId).replace("{SiteId}", element.SiteId),
          "method": "GET",
          "id": count
        });
        count++;
      } else if (count === 21) {
        Items.push(HeaderDriveItemsId);
        HeaderDriveItemsId = {
          "requests": []
        };
        count = 1;
        HeaderDriveItemsId.requests.push({
          "url": graphQuery.replace("{driveId}", element.DriveId).replace("{ItemID}", element.ItemId).replace("{SiteId}", element.SiteId),
          "method": "GET",
          "id": count
        });
        count++;
      }
      if (index === followDocuments.length - 1) {
        Items.push(HeaderDriveItemsId);
        HeaderDriveItemsId = {
          "requests": []
        };
        count = 1;
      }
    });
    return Items;
  }
}
