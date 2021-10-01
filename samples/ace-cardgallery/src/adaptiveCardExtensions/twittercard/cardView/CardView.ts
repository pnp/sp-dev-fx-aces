import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'TwittercardAdaptiveCardExtensionStrings';
import { Tweet } from '../../../models/cg.models';
import { ITwittercardAdaptiveCardExtensionProps, ITwittercardAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../TwittercardAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<ITwittercardAdaptiveCardExtensionProps, ITwittercardAdaptiveCardExtensionState> {
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
    const latestTweet: Tweet = this.state.tweets[this.state.currentTweetId];
    return {
      primaryText: `${this.state.tweets.length} ${strings.PrimaryText}`,
      description: latestTweet.text
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: 'https://www.bing.com'
      }
    };
  }
}
