import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'StocktickterAdaptiveCardExtensionStrings';
import { IStocktickterAdaptiveCardExtensionProps, IStocktickterAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../StocktickterAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<IStocktickterAdaptiveCardExtensionProps, IStocktickterAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.QuickViewButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  }

  public get data(): IPrimaryTextCardParameters {
    return {
      primaryText: this.state.stock.symbol,
      description: strings.Description.replace("{__StockDirection__}", (this.state.stock.change > 0) ? strings.Up : strings.Down)
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'QuickView',
      parameters: {
        view: QUICK_VIEW_REGISTRY_ID
      }
    };
  }
}
