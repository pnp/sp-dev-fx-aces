import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { SharePointCrudExamplePropertyPane } from './SharePointCrudExamplePropertyPane';
import { DemoItem } from '../models/models';
import { SPCRUD } from '../services/spcrud.service';
import { EditView } from './quickView/EditView';
import { NewView } from './quickView/NewView';
import { DisplayView } from './quickView/DisplayView';

export interface ISharePointCrudExampleAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
  homeSite: string;
}

export interface ISharePointCrudExampleAdaptiveCardExtensionState {
  homeSite: string;
  items: DemoItem[];
  currentItemID: number;
  description: string;
}

export const CARD_VIEW_REGISTRY_ID = 'CRUDDemo_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID = 'CRUDDemo_QUICK_VIEW';
export const DISPLAY_VIEW_REGISTRY_ID = 'CRUDDemo_DISPLAY_VIEW';
export const EDIT_VIEW_REGISTRY_ID = 'CRUDDemo_EDIT_VIEW';
export const NEW_VIEW_REGISTRY_ID = 'CRUDDemo_NEW_VIEW';

export default class SharePointCrudExampleAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ISharePointCrudExampleAdaptiveCardExtensionProps,
  ISharePointCrudExampleAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: SharePointCrudExamplePropertyPane | undefined;
  private LOG_SOURCE = "🔶 SharePointCrudExampleAdaptiveCardExtension";
  private _myItems: DemoItem[] = [];

  public async onInit(): Promise<void> {
    try {
      if (this.properties.homeSite == undefined || this.properties.homeSite.length < 1) {
        this.properties.homeSite = this.context.pageContext.site.absoluteUrl;
      }
      //Initialize Service
      await SPCRUD.Init(this.context.serviceScope);

      this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
      this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
      this.quickViewNavigator.register(DISPLAY_VIEW_REGISTRY_ID, () => new DisplayView());
      this.quickViewNavigator.register(EDIT_VIEW_REGISTRY_ID, () => new EditView());
      this.quickViewNavigator.register(NEW_VIEW_REGISTRY_ID, () => new NewView());

      //Get the items for the current user;
      this._myItems = await SPCRUD.GetItemsByUser(this.context.pageContext.user.loginName);

      this.state = {
        homeSite: this.properties.homeSite,
        items: this._myItems,
        currentItemID: 1,
        description: this.properties.description
      };


    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(onInit) - ${err.message}`);
    }

  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'SharePointCrudExample-property-pane'*/
      './SharePointCrudExamplePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.SharePointCrudExamplePropertyPane();
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
