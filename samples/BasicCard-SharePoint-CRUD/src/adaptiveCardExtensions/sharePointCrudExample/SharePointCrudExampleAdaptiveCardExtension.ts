import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { SharePointCrudExamplePropertyPane } from './SharePointCrudExamplePropertyPane';
import { DemoItem } from '../models/models';
import { SPCRUD } from '../services/spcrud.service';
import { sp } from "@pnp/sp";
import { EditView } from './quickView/EditView';
import { NewView } from './quickView/NewView';

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

export const CARD_VIEW_REGISTRY_ID: string = 'CRUDDemo_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'CRUDDemo_QUICK_VIEW';
export const EDIT_VIEW_REGISTRY_ID: string = 'CRUDDemo_EDIT_VIEW';
export const NEW_VIEW_REGISTRY_ID: string = 'CRUDDemo_NEW_VIEW';

export default class SharePointCrudExampleAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ISharePointCrudExampleAdaptiveCardExtensionProps,
  ISharePointCrudExampleAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: SharePointCrudExamplePropertyPane | undefined;
  private LOG_SOURCE: string = "🔶 SharePointCrudExampleAdaptiveCardExtension";
  private _myItems: DemoItem[] = [];

  public async onInit(): Promise<void> {
    try {
      if (this.properties.homeSite == undefined || this.properties.homeSite.length < 1) {
        this.properties.homeSite = this.context.pageContext.site.absoluteUrl;
      }

      await SPCRUD.Init(this.properties.homeSite);

      this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
      this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
      this.quickViewNavigator.register(EDIT_VIEW_REGISTRY_ID, () => new EditView());
      this.quickViewNavigator.register(NEW_VIEW_REGISTRY_ID, () => new NewView());

      //Initialize PnPLogger
      Logger.subscribe(new ConsoleListener());
      Logger.activeLogLevel = LogLevel.Info;

      //Initialize PnPJs
      sp.setup({ spfxContext: this.context });

      //Get the items for the current user;
      this._myItems = await SPCRUD.GetItemsByUser(this.context.pageContext.user.loginName);


      this.state = {
        homeSite: this.properties.homeSite,
        items: this._myItems,
        currentItemID: 0,
        description: this.properties.description
      };


    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onInit) - ${err.message}`, LogLevel.Error);
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
