import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { AceMyLocationPropertyPane } from './AceMyLocationPropertyPane';
import { spfi, SPFx, SPFI } from "@pnp/sp";
import { MSGraphClientV3 } from '@microsoft/sp-http';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { User } from '@microsoft/microsoft-graph-types';

export interface IAceMyLocationAdaptiveCardExtensionProps {
  title: string;
  listGUID: string;
  imageUrl?: string;
  description?: string;
  defaultUrl?:string;
  defaultLocationName?:string;
  mode: "officeLocation" | "groupMembership";
  fabricIconName?: string;        
}

export interface IAceMyLocationAdaptiveCardExtensionState {
  officeUrl?: string;
  imageUrl?: string;
  locationName?: string;
}

interface ILocationListItem {
  Title: string;
  URL: string;
  imageURL?: string;
}

export const CARD_VIEW_REGISTRY_ID: string = 'AceMyLocation_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'AceMyLocation_QUICK_VIEW';

export default class AceMyLocationAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IAceMyLocationAdaptiveCardExtensionProps,
  IAceMyLocationAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: AceMyLocationPropertyPane;
  private sp: SPFI;

  public async onInit(): Promise<void> {
  this.state = {
    imageUrl: this.properties.imageUrl
  };

  this.sp = spfi().using(SPFx(this.context));

  let item: ILocationListItem | null = null;

  if (this.properties.mode === 'groupMembership') {
    item = await this._getListItemByGroupMembership();
  } else {
    item = await this._getListItemByOfficeLocation();
  }

  if (item) {
    this.setState({
      officeUrl: item.URL,
      imageUrl: item.imageURL || this.properties.imageUrl,
      locationName: item.Title
    });
  }

  this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
  this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

  return Promise.resolve();
}

  private async _getOfficeLocation(): Promise<string | null> {
    const userProperties = await this._getUserProperties();
    return userProperties?.officeLocation || null;
  }

  private async _getUserProperties(): Promise<User | null> {
    try {
      const client: MSGraphClientV3 = await this.context.msGraphClientFactory.getClient("3");
      return await client.api('/me').get();
    } catch (error) {
      console.error("Error fetching user properties:", error);
      return null;
    }
  }

  private async _getListItemByGroupMembership(): Promise<ILocationListItem | null> {
  try {
    const graphClient = await this.context.msGraphClientFactory.getClient("3");
    const response = await graphClient.api('/me/memberOf').get();

    const userGroupIds: string[] = response.value.map((group: any) => group.id);

    if (userGroupIds.length === 0) return null;

    const listGUID = this.properties.listGUID;
    if (!listGUID) return null;

    // Build OData filter for group IDs
    const filterString = userGroupIds.map(id => `GroupId eq '${id}'`).join(" or ");

    const items = await this.sp.web.lists.getById(listGUID).items
      .filter(filterString)
      .select("Title", "URL", "imageURL", "GroupId")
      .top(1)();

    return items.length > 0 ? items[0] : null;
  } catch (error) {
    console.error("Error in _getListItemByGroupMembership (with filter):", error);
    return null;
  }
}
  
  private async _getListItemByOfficeLocation(): Promise<ILocationListItem | null> {
    const officeLocation = await this._getOfficeLocation();
    if (!officeLocation) return null;

    const listGUID = this.properties.listGUID;
    if (!listGUID) return null;

    try {
      const items = await this.sp.web.lists.getById(listGUID).items
        .filter(`Title eq '${officeLocation}'`)
        .select("Title", "URL", "imageURL")
        .top(1)();

      return items.length > 0 ? items[0] : null;
    } catch (error) {
      console.error("Error fetching list item:", error);
      return null;
    }
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'AceMyLocation-property-pane'*/
      './AceMyLocationPropertyPane'
    ).then(component => {
      this._deferredPropertyPane = new component.AceMyLocationPropertyPane();
    });
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane.getPropertyPaneConfiguration();
  }
}
