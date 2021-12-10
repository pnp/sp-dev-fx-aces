import { IPropertyPaneConfiguration } from "@microsoft/sp-property-pane";
import { BaseAdaptiveCardExtension } from "@microsoft/sp-adaptive-card-extension-base";
import { CardView } from "../../cards/cardView";
import { QuickView } from "../../cards/quickView";

import { AceMyNotificationsPropertyPane } from "./AceMyNotificationsPropertyPane";
import { IActivity, INotification } from "../../models";
import { BaseComponentContext } from "@microsoft/sp-component-base";
import {   isEmpty } from "lodash";
import { IPropertyFieldSite } from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";
import { Services } from "../../services";
import { Socket } from "socket.io-client";

import { EActions } from "../../constants/EActions";
import { IListNotifications } from "../../models/IListNotifications";

export interface IAceMyNotificationsAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
  context: BaseComponentContext;
  selectedList: any;
  selectedSite: IPropertyFieldSite[];
}

let services: Services = undefined;
let selectedSiteId: string = "";
let selectedListId: string = "";
let _this: any;

export interface IAceMyNotificationsAdaptiveCardExtensionState {
  subTitle?: string;
  listNotifications: IListNotifications[];
  socketIoId: Socket;
  fromCard: number;
}

const PROFILE_URL = "https://spteck.sharepoint.com/_layouts/15/userphoto.aspx?size=S&accountname=";
const CARD_VIEW_REGISTRY_ID: string = "AceMyNotifications_CARD_VIEW";
export const QUICK_VIEW_REGISTRY_ID: string = "AceMyNotifications_QUICK_VIEW";

export default class AceMyNotificationsAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IAceMyNotificationsAdaptiveCardExtensionProps,
  IAceMyNotificationsAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: AceMyNotificationsPropertyPane | undefined;

  public async onInit(): Promise<void> {
    _this = this;
    services = new Services(this.context);
    await services.init();

    this.state = {
      listNotifications: [],
      socketIoId: undefined,
      fromCard: 1,
    };

    selectedListId = this.properties.selectedList?.id ?? "";
    selectedSiteId = this.properties.selectedSite ? this.properties.selectedSite[0]?.id : "";

    if (selectedListId) {
      await this.subscribeListNotifications();
    }

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require("../../assets/SharePointLogo.svg");
  }

  protected get selectedList(): any {
    return this.properties.selectedList;
  }
  protected get selectedSite(): IPropertyFieldSite[] {
    return this.properties.selectedSite;
  }

  private subscribeListNotifications = async () => {
    try {
      const subscription = await services.getListSockectIo(selectedSiteId, selectedListId);
      console.log(subscription);
      if (!isEmpty(subscription)) {
        // Disconnect previous sockect if active
        if (this.state?.socketIoId) {
          this.state.socketIoId.removeAllListeners();
        }
        const notificationsUrl = subscription.notificationUrl;
        const sockitIOid = services.connectToSocketListServer(notificationsUrl, this.handleNotifications);
        this.setState({ socketIoId: sockitIOid });
      }
    } catch (error) {
      console.log(error);
    }
  }

  protected onPropertyPaneFieldChanged = async (propertyPath: string, oldValue: any, newValue: any) => {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);

    if (propertyPath == "selectedSite" && newValue !== oldValue) {
      const site: IPropertyFieldSite[] = newValue as IPropertyFieldSite[];
      this.properties.selectedList = undefined;
      selectedSiteId = site[0]?.id ?? "";
      this.context.propertyPane.refresh();
    }
    if (propertyPath == "selectedList" && newValue != oldValue) {
      selectedListId = newValue.id;
      this.setState({ listNotifications: [] });
      await this.subscribeListNotifications();
      this.context.propertyPane.refresh();
    }
    this.context.propertyPane.refresh();
    this.renderCard();
  }

  protected async loadPropertyPaneResources(): Promise<void> {
    const component = await import(
      /* webpackChunkName: 'AceMyNotifications-property-pane'*/
      "./AceMyNotificationsPropertyPane"
    );

    this._deferredPropertyPane = new component.AceMyNotificationsPropertyPane(
      this.context,
      this.properties,
      this.onPropertyPaneFieldChanged
    );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }

  public async handleNotifications(data: string): Promise<void> {
    const notifications: INotification[] = JSON.parse(data).value;

    for (const notification of notifications) {
      // get siteID from lists
      console.log("notification", notification);
      const activities: IActivity[] = await services.getListActivities(selectedSiteId, selectedListId);
      await _this.addActivityToList(activities[0]);
    }
  }

  private getActionDescription = (actionKey: string): string => {
    switch (actionKey) {
      case EActions.delete:
        return "deleted";

      case EActions.create:
        return "created";
      case EActions.comment:
        return "commented";
      case EActions.copy:
        return "copied";
      case EActions.edit:
        return "edited";
      case EActions.mention:
        return "mentioned";
      case EActions.mention:
        return "mentioned";
      case EActions.move:
        return "moved";
      case EActions.rename:
        return "renamed";
      case EActions.restore:
        return "restored";
      case EActions.share:
        return "shared";
      case EActions.version:
        return "versioned";
      default:
        break;
    }
  }

  private addActivityToList = async (activity: IActivity) => {
    try {
      console.log("Activities", activity);
      const { action, actor } = activity;
      const newlistNotifications: IListNotifications[] = this.state.listNotifications;

      const { itemInfo, type } = await services.getListItem(selectedSiteId, selectedListId, activity);
      const actionKey = Object.keys(action)[0];
      console.log("del", action);

      if (actionKey === EActions.delete) {
        newlistNotifications.push({
          author: {
            displayName: actor.user.displayName,
            email: actor.user.email,
            profilePhotoUrl: `${PROFILE_URL}${actor.user.email}`,
          },
          date: activity.times.recordedDateTime,
          type: type,
          url: "",
          name: action.delete.name,
          action: this.getActionDescription(actionKey),
        });
      }

      if (type === "file" && actionKey != EActions.delete) {
        newlistNotifications.push({
          author: {
            displayName: actor.user.displayName,
            email: actor.user.email,
            profilePhotoUrl: `${PROFILE_URL}${actor.user.email}`,
          },
          date: activity.driveItem.createdDateTime,
          type: type,
          url: itemInfo.webUrl,
          name: activity.driveItem.name,
          action: this.getActionDescription(actionKey),
        });
      }

      if (type === "listItem" && actionKey != EActions.delete) {
        const listItem = itemInfo as any;
        const { Title, id } = listItem.fields;
        newlistNotifications.push({
          author: {
            displayName: actor.user.displayName,
            email: actor.user.email,
            profilePhotoUrl: `${PROFILE_URL}${actor.user.email}`,
          },
          date: listItem.createdDateTime,
          type: type,
          url: listItem.webUrl.replace(`${id}_.000`, `dispForm.aspx?ID=${id} `),
          name: Title,
          action: this.getActionDescription(actionKey),
        });
      }

      this.setState({ listNotifications: (newlistNotifications.reverse() ) });
    } catch (error) {}
  }
}
