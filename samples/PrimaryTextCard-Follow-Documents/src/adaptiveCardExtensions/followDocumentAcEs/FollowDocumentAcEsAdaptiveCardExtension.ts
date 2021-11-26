import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { FollowDocumentAcEsPropertyPane } from './FollowDocumentAcEsPropertyPane';
import { FollowDocument } from './models/followDocument';
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';

import Graph from "./Service/GraphService";
import * as strings from 'FollowDocumentAcEsAdaptiveCardExtensionStrings';

export interface IFollowDocumentAcEsAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
  MockupData: boolean;
  view: string;
  URL: string;
}

export interface IFollowDocumentAcEsAdaptiveCardExtensionState {
  followDocuments: FollowDocument[];
  ID: number;
}

const CARD_VIEW_REGISTRY_ID: string = 'FollowDocumentAcEs_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'FollowDocumentAcEs_QUICK_VIEW';

export default class FollowDocumentAcEsAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IFollowDocumentAcEsAdaptiveCardExtensionProps,
  IFollowDocumentAcEsAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: FollowDocumentAcEsPropertyPane | undefined;

  public onInit(): Promise<void> {
    let followDocuments: FollowDocument[] = [];
    return this.getFollowDocuments(followDocuments).then((Items: FollowDocument[]) => {
      Items = Items.sort((a, b) => {
        return b.followedDateTime.getTime() - a.followedDateTime.getTime();
      });
      if (this.properties.MockupData == true) {
        followDocuments = require("../mocks/QuickViewTemplate.json");
      } else {
        if (this.properties.view === "Slider" || this.properties.view === undefined) {
          followDocuments = Items;
        } else {
          followDocuments = Items;
        }
      }

      this.state = {
        ID: 1,
        followDocuments: followDocuments,
      };

      this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
      this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

      return Promise.resolve();
    });

  }

  private getFollowDocuments = async (followDocuments: FollowDocument[]): Promise<any> => {
    const graphService: Graph = new Graph();
    let graphData: any = [];
    graphData = await graphService.getGraphContent(`https://graph.microsoft.com/v1.0/me/drive/following?$select=id,name,webUrl,parentReference,followed&Top=1000`, this.context);
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
          followDocument.IconUrl = this.context.pageContext.web.absoluteUrl + "/_layouts/images/" + icon;
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
    const initialized = await graphService.initialize(this.context.serviceScope);
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
            if (followDocument.DriveId === driveId && (followDocument.Folder === undefined || followDocument.Folder === "")) {
              followDocument.ListId = data.body.id;
              followDocument.Folder = data.body.webUrl;
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
    const initialized = await graphService.initialize(this.context.serviceScope);
    if (initialized) {
      const requests = this.getBatchRequest(followDocuments, "/me/drives/{driveId}/items/{ItemID}?$select=id,content.downloadUrl,ListItem&expand=ListItem(select=id,webUrl),thumbnails(select=large)");
      for (let index = 0; index < requests.length; index++) {
        const graphData: any = await graphService.postGraphContent("https://graph.microsoft.com/v1.0/$batch", requests[index]);
        graphData.responses.forEach((data: any) => {
          followDocuments.forEach((followDocument: FollowDocument) => {

            if (followDocument.ItemId === data.body.id && followDocument.Url === undefined) {
              followDocument.id = data.body.listItem.id;
              followDocument.Url = data.body.listItem.webUrl;
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
    const initialized = await graphService.initialize(this.context.serviceScope);
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
              followDocument.WebName = (data.body.name !== ""? data.body.name : data.body.displayName);
              items.push(followDocument);
            }
          });
        });
        return items;
      }
    }

  }

  public GetIcon = async (name: string): Promise<string> => {
    var url = `${this.context.pageContext.web.absoluteUrl}/_api/web/maptoicon(filename='${name}',%20progid='',%20size=0)`;
    const value = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse): Promise<{
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

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'FollowDocumentAcEs-property-pane'*/
      './FollowDocumentAcEsPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.FollowDocumentAcEsPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
}