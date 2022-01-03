import { DriveItem, ListItem, Site, Subscription } from "@microsoft/microsoft-graph-types";
import { BaseComponentContext } from "@microsoft/sp-component-base";
import { IActivity } from "../models";
import { Socket } from "socket.io-client";
export declare enum EListType {
    "file" = "file",
    "listItem" = "listItem"
}
export declare class Services {
    private _context;
    private _msGraphClient;
    constructor(context: BaseComponentContext);
    init: () => Promise<void>;
    getSiteInfoByRelativeUrl: (url: string) => Promise<Site>;
    getListActivities: (siteId: string, listId: string) => Promise<IActivity[]>;
    getListInfo: (siteId: string, listId: string) => Promise<any>;
    getListItem: (siteId: string, listId: string, activity: IActivity) => Promise<{
        itemInfo: ListItem | DriveItem;
        type: string;
    }>;
    getLists: (searchString: string) => Promise<any>;
    getListSockectIo: (siteId: string, listId: string) => Promise<Subscription>;
    connectToSocketListServer: (notificationUrl: string, handleNotifications: any) => Socket;
}
//# sourceMappingURL=services.d.ts.map