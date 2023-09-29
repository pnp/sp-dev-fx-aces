import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton,
  // ISubmitActionArguments,
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PromotePagesAdaptiveCardExtensionStrings';
import {
  IPromotePagesAdaptiveCardExtensionProps,
  IPromotePagesAdaptiveCardExtensionState,
  PAGE_LIST_VIEW_REGISTRY_ID
} from '../PromotePagesAdaptiveCardExtension';
import { GraphSitePage } from "./../../types"
export class CardView extends BaseImageCardView<
  IPromotePagesAdaptiveCardExtensionProps,
  IPromotePagesAdaptiveCardExtensionState
> {
  /**
   * Buttons will not be visible if card size is 'Medium' with Image Card View.
   * It will support up to two buttons for 'Large' card size.
   */
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.QuickViewButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: PAGE_LIST_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  }

  public get data(): IImageCardParameters {
    if (this.state.pages.length > 0) {

      const mostRecentpage: GraphSitePage = this.state.pages[0];
      return {
        primaryText: mostRecentpage.title,
        imageUrl: mostRecentpage.thumbnailWebUrl,
        title: this.properties.title
      };

    } else {
      return {
        primaryText: "No recent page found. Try to change the source in the property pane.",
        imageUrl: require('./../assets/MicrosoftLogo.png'),
        title: this.properties.title
      };
    }
  }



  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    if (this.state.pages.length > 0) {

      return {
        type: 'ExternalLink',
        parameters: {
          target: this.state.pages[0].webUrl
        }
      };

    } else {
      return {
        type: 'ExternalLink',
        parameters: {
          target: "https://github.com/"
        }
      };
    }
  }
}
