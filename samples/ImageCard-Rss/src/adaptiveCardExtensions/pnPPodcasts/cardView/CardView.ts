import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PnPPodcastsAdaptiveCardExtensionStrings';
import { IPnPPodcastsAdaptiveCardExtensionProps, IPnPPodcastsAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../PnPPodcastsAdaptiveCardExtension';

export class CardView extends BaseImageCardView<IPnPPodcastsAdaptiveCardExtensionProps, IPnPPodcastsAdaptiveCardExtensionState> {
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
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  }

  public get data(): IImageCardParameters {
    return {
      primaryText: this.state.Items[0].title,
      imageUrl: (this.properties.logo === undefined? this.state.channel.image.url:this.properties.logo),
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: this.properties.URL === undefined || this.properties.URL.length == 0 ? 'https://pnpweekly.podbean.com' : this.properties.URL,
      }
    };
  }
}
