import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { RecentSalesPropertyPane } from './RecentSalesPropertyPane';
import { QuickView } from './quickView/QuickView';

export interface IRecentSalesAdaptiveCardExtensionProps {
  title: string;
}

export interface IRecentSalesAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'RecentSales_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'RecentSales_QUICK_VIEW';


export default class RecentSalesAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IRecentSalesAdaptiveCardExtensionProps,
  IRecentSalesAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: RecentSalesPropertyPane;

  public onInit(): Promise<void> {
    this.state = { };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    // registers the quick view to open via QuickView action
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'RecentSales-property-pane'*/
      './RecentSalesPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.RecentSalesPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }
}
