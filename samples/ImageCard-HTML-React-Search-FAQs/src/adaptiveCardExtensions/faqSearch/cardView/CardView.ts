import {
  IExternalLinkCardAction,
  IQuickViewCardAction,
  IImageCardParameters,
  BaseImageCardView,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import {
  IFaqSearchAdaptiveCardExtensionProps,
  IFaqSearchAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID,
} from '../FaqSearchAdaptiveCardExtension';
import * as strings from 'FaqSearchAdaptiveCardExtensionStrings';

export class CardView extends BaseImageCardView<
  IFaqSearchAdaptiveCardExtensionProps,
  IFaqSearchAdaptiveCardExtensionState
> {
  // Provide the image card data
  public get data(): IImageCardParameters {
    return {
      title: this.properties.title || strings.Title,
      primaryText: this.properties.heading || strings.PrimaryText,
      imageUrl: this.getImageUrl(),
      imageAltText: strings.ImageAltText || 'FAQ Image'   // Alt text for the image
    };
  }

  private getImageUrl(): string {
    if (this.properties.imageUrl) {
      return this.properties.imageUrl;
    }
    return require("../assets/faqs-image.jpg");
  }

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

  // Define what happens when the card is selected (click action)
  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: 'https://www.bing.com' // Replace with your target URL
      }
    };
  }
}
