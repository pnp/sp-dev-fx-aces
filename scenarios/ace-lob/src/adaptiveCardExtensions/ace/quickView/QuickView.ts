import { BaseAdaptiveCardView, ISPFxAdaptiveCard } from '@microsoft/sp-adaptive-card-extension-base';
import { IAceAdaptiveCardExtensionProps, IAceAdaptiveCardExtensionState } from '../AceAdaptiveCardExtension';

export interface IQuickViewData {
  orders: any[];
}

export class QuickView extends BaseAdaptiveCardView<
  IAceAdaptiveCardExtensionProps,
  IAceAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      orders: this.state.orders
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}