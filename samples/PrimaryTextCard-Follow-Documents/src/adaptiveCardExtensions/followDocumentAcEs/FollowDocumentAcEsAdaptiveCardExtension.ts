import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { FollowDocumentAcEsPropertyPane } from './FollowDocumentAcEsPropertyPane';
import { FollowDocument } from './models/followDocument';

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

    return this.getGraphFollowedDocs().then((Items) => {
      let followDocuments: FollowDocument[] = [];

      if (this.properties.MockupData == true ) {
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

  private getGraphFollowedDocs = async (): Promise<any> => {
    const GraphService: Graph = new Graph();
    let DriveItem: any = [];
    let graphData: any = await GraphService.getGraphContent("https://graph.microsoft.com/v1.0/me/drive/list?$select=parentReference", this.context);
    DriveItem = await this.getListID(graphData.parentReference.siteId);
    return DriveItem;
  }

  private getListID = async (siteId: string): Promise<string> => {
    const GraphService: Graph = new Graph();
    let graphData: any = await GraphService.getGraphContent(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists?$select=id&$filter=displayName eq 'Social'`, this.context);
    const DriveItem: string = await this.getFollowDocuments(siteId, graphData.value[0].id);
    return DriveItem;
  }

  private getFollowDocuments = async (siteId: string, listId: string): Promise<any> => {
    const GraphService: Graph = new Graph();
    let graphData: any = [];
    graphData = await GraphService.getGraphContent(`https://graph.microsoft.com/v1.0/sites/${siteId}/Lists/${listId}/items?$select=id,fields&expand=fields(select=ItemId,ListId,SiteId,webId,Title,Url,ServerUrlProgid,IconUrl,File_x0020_Type.progid,ItemUniqueId)&$filter=fields/ItemId gt -1`, this.context);
    graphData.value = graphData.value.sort((a, b) => {
      return b.id - a.id;
    });

    //Get Web site Name 
    graphData = await this.getFollowDocumentsWebName(graphData);

    return graphData;
  }

  private getFollowDocumentsWebName = async (graphData) => {
    let _webs = [];
    graphData.value.forEach(element => {
      if (_webs.indexOf(element.fields.WebId) === -1) {
        _webs.push(element.fields.WebId);
      }
    });
    graphData = await this.getSearchWebID(graphData.value, _webs);
    return graphData;
  }

  //get Web Name and Web Url of Document
  private getSearchWebID = async (graphData: any[], webs: any[]): Promise<any[]> => {
    
    const graphService: Graph = new Graph();
    const initialized = await graphService.initialize(this.context.serviceScope);
    let queryString: string = "";
    for (let index = 0; index < webs.length; index++) {
      if (index === 0) {
        queryString += "WebId:" + webs[index].replace('{', '').replace('}', '');
      } else {
        queryString += " OR WebId:" + webs[index].replace('{', '').replace('}', '') + " ";
      }
    }
    if (initialized) {
      const HeaderWeb = {
        "requests": [
          {
            "entityTypes": [
              "site"
            ],
            "query": {
              "queryString": "" + queryString + "",
            },
            "fields": [
              "id",
              "name",
              "webUrl"
            ],
            "from": 0,
            "size": 1000
          }
        ]
      };
      //Retrieve webNames
      const tmpWebs = await graphService.postGraphContent("https://graph.microsoft.com/v1.0/search/query", HeaderWeb);
      graphData.forEach(element => {
        tmpWebs.value[0].hitsContainers[0].hits.forEach(Webelement => {
          if (element.fields.WebId.replace('{', '').replace('}', '') === Webelement.resource.id.split(/[, ]+/).pop().toUpperCase()) {
            element.WebName = Webelement.resource.name;
            element.WebUrl = Webelement.resource.webUrl;
          }
        }
        );
      });
      return await this.getFollowDocumentsDriveItemName(graphData);
    }
  }

  private getFollowDocumentsDriveItemName = async (graphData: any[]): Promise<any[]> => {
    console.log(graphData);
    const graphService: Graph = new Graph();
    const initialized = await graphService.initialize(this.context.serviceScope);
    let queryString: string = "";
    for (let index = 0; index < graphData.length; index++) {
      if (index === 0) {
        queryString += "(WebId:" + String(graphData[index].fields.WebId).substring(1, 37) + " ListID:" + String(graphData[index].fields.ListId).substring(1, 37) + " listItemId:" + graphData[index].fields.ItemId + ") ";
      } else {
        queryString += " OR (WebId:" + String(graphData[index].fields.WebId).substring(1, 37) + " ListID:" + String(graphData[index].fields.ListId).substring(1, 37) + " listItemId:" + graphData[index].fields.ItemId + ") ";
      }
    }
    if (initialized) {
      const HeaderWeb = {
        "requests": [
          {
            "entityTypes": [
              "driveItem"
            ],
            "query": {
              "queryString": "" + queryString + "",
            },
            "fields": [
              "id",
              "parentReference",
              "webUrl"
            ],
            "from": 0,
            "size": 1000
          }
        ]
      };
      //Retrieve FileIDs
      const tmpWebs = await graphService.postGraphContent("https://graph.microsoft.com/v1.0/search/query", HeaderWeb);
console.log(tmpWebs.value[0].hitsContainers[0].hits);
      let data: any[] = [];
      graphData.forEach((element, index) => {

        tmpWebs.value[0].hitsContainers[0].hits.forEach(Webelement => {
          
          if (String(element.fields.ItemUniqueId).substring(1, 37).toLowerCase() === Webelement.resource.parentReference.sharepointIds.listItemUniqueId.toLowerCase() && String(element.fields.ListId).substring(1, 37).toLowerCase() === Webelement.resource.parentReference.sharepointIds.listId.toLowerCase()) {
            if (element.fields.IconUrl.indexOf("lg_iczip.gif") > -1) {
              element.fields.IconUrl = element.fields.IconUrl.replace("lg_iczip.gif", "lg_iczip.png");
            }
            if (element.fields.IconUrl.indexOf("lg_icmsg.png") > -1) {
              element.fields.IconUrl = element.fields.IconUrl.replace("lg_icmsg.png", "lg_icmsg.gif");
            }
            let domain = (new URL(element.fields.Url));
            element.Domain = domain.hostname;
            element.Folder = element.fields.Url.replace(element.fields.Title, "");
            element.ItemId = Webelement.resource.id;
            element.DriveId = Webelement.resource.parentReference.driveId;
            element.SiteId = Webelement.resource.parentReference.siteId;
            data.push(element);
          }
        }
        );
      });
     
      return await this.getDriveItemNameThumbnails(data);
    }
  }

  private getDriveItemNameThumbnails = async (graphData: any[]): Promise<any[]> => {
    ///
    const graphService: Graph = new Graph();
    let data: any[] = [];
    graphData.forEach(async (element, index) => {
      if (element.SiteId !== undefined) {
        const tmpWebs = await graphService.getGraphContent("https://graph.microsoft.com/v1.0/sites/" + element.SiteId + "/drive/items/" + element.ItemId + "/thumbnails", this.context);
        if (tmpWebs.value.length > 0) {
          element.fields.Thumbnail = tmpWebs.value[0].large.url;
          data.push(element);
        }
      }

    });
    return await this.getSearchListItemID(graphData);
  }

  private getSearchListItemID = async (graphData: any[]): Promise<any[]> => {
    const graphService: Graph = new Graph();
    const initialized = await graphService.initialize(this.context.serviceScope);
    if (initialized) {
      graphData.forEach(async (element, index) => {
        const QueryString = "WebId:" + String(element.fields.WebId).substring(1, 37) + " ListID:" + String(element.fields.ListId).substring(1, 37);
        const HeaderListId = {
          "requests": [
            {
              "entityTypes": [
                "list"
              ],
              "query": {
                "queryString": "" + QueryString + "",
              },
              "fields": [
                "webUrl"
              ],
              "from": 0,
              "size": 1000
            }
          ]
        };
        const tmpFileID = await graphService.postGraphContent("https://graph.microsoft.com/v1.0/search/query", HeaderListId);
        element.ItemProperties = tmpFileID.value[0].hitsContainers[0].hits[0].resource.webUrl.substring(0, tmpFileID.value[0].hitsContainers[0].hits[0].resource.webUrl.lastIndexOf("/")) + "/dispForm.aspx?ID=" + element.fields.ItemId;
      });
      return await this.getFollowDocumentsLinkWeb(graphData);
    }
  }

  private getFollowDocumentsLinkWeb = async (graphData): Promise<any> => {
    const GraphService: Graph = new Graph();
    graphData.forEach(async (element, index) => {
      const Item = await GraphService.getGraphContent(`https://graph.microsoft.com/v1.0/sites/${element.SiteId}/Drive/items/${element.ItemId}?$select=id,webUrl,content.downloadUrl`, this.context);
      if (element.ItemId === Item.id) {
        element.WebFileUrl = Item.webUrl;
        element.DownloadFile =Item["@microsoft.graph.downloadUrl"]; 
      }
    });

    return graphData;
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