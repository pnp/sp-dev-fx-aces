import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { Stock } from '../../../models/cg.models';
import { IStocktickterAdaptiveCardExtensionProps, IStocktickterAdaptiveCardExtensionState } from '../StocktickterAdaptiveCardExtension';

export interface IQuickViewData {
  stock: Stock;
}

export class QuickView extends BaseAdaptiveCardView<
  IStocktickterAdaptiveCardExtensionProps,
  IStocktickterAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    const { stock } = this.state;
    return {
      stock: stock
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}