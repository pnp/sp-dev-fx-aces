import {
  BaseAdaptiveCardExtension,
} from '@microsoft/sp-adaptive-card-extension-base';
import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';

import { IOrder } from '../../models/IOrder';
import { Services } from '../../services/services';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { SalesOrdersPropertyPane } from './SalesOrdersPropertyPane';

export interface ISalesOrdersAdaptiveCardExtensionProps {
  title: string;
}

export interface ISalesOrdersAdaptiveCardExtensionState {
  orders:IOrder[];
}

const CARD_VIEW_REGISTRY_ID: string = 'SalesOrders_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'SalesOrders_QUICK_VIEW';

export default class SalesOrdersAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ISalesOrdersAdaptiveCardExtensionProps,
  ISalesOrdersAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: SalesOrdersPropertyPane;
  private _services: Services;

  public async onInit(): Promise<void> {

    this._services = new Services(this.context);
    const result =  await this._services.searchOrders("");
    this.state = { orders: result};

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    // registers the quick view to open via QuickView action
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'SalesOrders-property-pane'*/
      './SalesOrdersPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.SalesOrdersPropertyPane();
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
