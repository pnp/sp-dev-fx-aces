import {
  IImageCardParameters,
  BaseImageCardView,
  ICardButton,
  IExternalLinkCardAction,
  IQuickViewCardAction
} from '@microsoft/sp-adaptive-card-extension-base';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import {
  IStockpriceAdaptiveCardExtensionProps,
  IStockpriceAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID
} from '../StockpriceAdaptiveCardExtension';

export class CardView extends BaseImageCardView<
  IStockpriceAdaptiveCardExtensionProps,
  IStockpriceAdaptiveCardExtensionState
> {
  public get data(): IImageCardParameters {

    const { theme } = this.state;
    let { companyName } = this.properties;

    // set companyName to 'Microsoft' if it is empty
    if (isEmpty(companyName)) {
      companyName = 'Microsoft';
    }

    // get the colours for the placeholder image
    const palette = theme?.palette;
    const placeholderBackgroundColor = palette?.themePrimary?.replace('#', '') || '0078d4';
    const placeholderTextColor = palette?.themeLighterAlt?.replace('#', '') || 'f3f2f1';


    return {
      title: this.properties.title,
      primaryText: '',
      imageUrl: this.properties.mainImage || `https://placehold.co/164x180/${placeholderBackgroundColor}/${placeholderTextColor}.webp?text=Stock price \\n chart of \\n ${companyName}`,
      imageAltText: this.properties.title
    };
  }

  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {

    let { stockSymbol } = this.properties;

    // set stockSymbol to 'MSFT' if it is empty
    if (isEmpty(stockSymbol)) {
      stockSymbol = 'MSFT';
    }

    return [
      {
        title: `See ${this.properties.stockSymbol} details`,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    ];
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
