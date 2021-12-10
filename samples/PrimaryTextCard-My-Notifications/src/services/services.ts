import { DriveItem, List, ListItem, Site, Subscription } from "@microsoft/microsoft-graph-types";
import { BaseComponentContext } from "@microsoft/sp-component-base";
import { HttpClient, HttpClientResponse, MSGraphClientFactory } from "@microsoft/sp-http";
import { IActivities, IActivity } from "../models";
import { io, Socket } from "socket.io-client";

export enum EListType {
  "file" = "file",
  "listItem" = "listItem",
}
export class Services {
  private _context: BaseComponentContext = undefined;
  private _msGraphClient = undefined;
  constructor(context: BaseComponentContext) {
    this._context = context;
  }
  public init = async  () => {
    this._msGraphClient = await this._context.msGraphClientFactory.getClient();
  }

  public getSiteInfoByRelativeUrl = async (url: string): Promise<Site> => {
    const hostName = location.hostname;
    try {

      if (!this._msGraphClient) return;
      const siteResults = await this._msGraphClient
        .api(`/sites/${hostName}:/${url}`)
        .select("sharepointIds, id, webUrl,displayName,parentReference")
        .get();
      return siteResults;
    } catch (error) {
      throw error;
    }
  }

  public getListActivities = async (siteId: string, listId: string): Promise<IActivity[]> => {
    try {
      if (!this._msGraphClient) return;
      const listsActivitiesResults = (await this._msGraphClient
        .api(`/sites/${siteId}/lists/${listId}/activities`)
        .expand("listItem($expand=fields),driveItem")
        .top(1)
        .version("beta")
        .get()) as IActivities;

      return listsActivitiesResults.value;
    } catch (error) {
      throw error;
    }
  }

  public getListInfo = async (siteId: string, listId: string) => {
    try {
      if (!this._msGraphClient) return;
      const siteResults = await this._msGraphClient.api(`/sites/${siteId}/lists/${listId}`).get();
      return siteResults;
    } catch (error) {
      throw error;
    }
  }

  public getListItem = async (
    siteId: string,
    listId: string,
    activity: IActivity
  ): Promise<{ itemInfo: ListItem | DriveItem; type: string }> => {
    if (!this._msGraphClient) return;
    let graphUrl = "";
    let itemId = "";
    let listItemResults: any;
    let type = activity?.driveItem ? "file" : activity?.listItem ? "listItem" : undefined;
    switch (type) {
      case EListType.file:
        try {
          const driveId = activity.driveItem.parentReference.driveId;
          itemId = activity.driveItem.parentReference.id;
          graphUrl = `/sites/${siteId}/drives/${driveId}/items/${itemId}`;
          listItemResults = (await this._msGraphClient.api(graphUrl).get()) as DriveItem;
          return { itemInfo: listItemResults, type: type };
        } catch (error) {
          return { itemInfo: undefined, type: type };
        }
      case EListType.listItem:
        try {
          itemId = activity.listItem.id;
          graphUrl = `/sites/${siteId}/lists/${listId}/items/${itemId}`;
          listItemResults = (await this._msGraphClient.api(graphUrl).get()) as ListItem;
          return { itemInfo: listItemResults, type: type };
        } catch (error) {
          return { itemInfo: undefined, type: type };
        }
      default:
        graphUrl = `/sites/${siteId}/lists/${listId}`;
        const lItemResults = (await this._msGraphClient.api(graphUrl).get()) as List;
        type = lItemResults.list.template === "documentLibrary" ? "file" : "listItem";
        return { itemInfo: undefined, type: type };
    }
  }


  public getLists =
    async (searchString: string) => {
     // this._msGraphClient = await this._context.serviceScope.consume(MSGraphClientFactory.serviceKey).getClient();
      const searchRequest = {
        requests: [
          {
            entityTypes: ["list"],
            query: { queryString: `${searchString}*` },
            sortProperties: [{ name: "name", isDescending: "false" }],
          },
        ],
      };
      const graphUrl = "/search/query";
      const listsResults = await this._msGraphClient.api(`${graphUrl} `).version("beta").post(searchRequest);
      return listsResults.value[0].hitsContainers[0];
    }

  public getListSockectIo = async (siteId: string, listId: string): Promise<Subscription> => {
    try {
      this._msGraphClient = await this._context.serviceScope.consume(MSGraphClientFactory.serviceKey).getClient();
      if (!this._msGraphClient) return;
      const listSubscription = (await this._msGraphClient
        .api(`/sites/${siteId}/lists/${listId}/subscriptions/socketIo`)
        .get()) as Subscription;
      return listSubscription;
    } catch (error) {
      throw error;
    }
  }

  public connectToSocketListServer = (notificationUrl: string, handleNotifications: any): Socket => {
    const split = notificationUrl.split("/callback?");


    const socket = io(split[0], { query: split[1] as any, transports: ["websocket"] });
    socket.on("connect", () => {
      console.log("Connected!", notificationUrl);
    });
    socket.on("notification", handleNotifications);
    socket.on("disconnect", (reason) => {
      console.log("disconnect", reason);
    });
    socket.on("connect_error", (reason) => {
      console.log("error", reason);
    });
    return socket;
  }
}
