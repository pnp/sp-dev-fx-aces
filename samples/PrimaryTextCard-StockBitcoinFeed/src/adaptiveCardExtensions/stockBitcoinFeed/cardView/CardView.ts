import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
} from '@microsoft/sp-adaptive-card-extension-base';
import { IStockBitcoinFeedAdaptiveCardExtensionProps, IStockBitcoinFeedAdaptiveCardExtensionState } from '../StockBitcoinFeedAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<IStockBitcoinFeedAdaptiveCardExtensionProps, IStockBitcoinFeedAdaptiveCardExtensionState> {

  public get data(): IPrimaryTextCardParameters {
    return {
      primaryText: `$ ${this.state.lastPrice}`,
      description: this.properties.description,
      title: this.properties.title
    };
  }
}
