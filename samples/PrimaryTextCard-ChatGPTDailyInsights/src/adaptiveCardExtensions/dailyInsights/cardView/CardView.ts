import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'DailyInsightsAdaptiveCardExtensionStrings';
import { IDailyInsightsAdaptiveCardExtensionProps, IDailyInsightsAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../DailyInsightsAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<IDailyInsightsAdaptiveCardExtensionProps, IDailyInsightsAdaptiveCardExtensionState> {
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
      primaryText: this.properties.primarytext? this.properties.primarytext : "Your Daily Insights",
      description: this.properties.primarydesc? this.properties.primarydesc :"Click explore to see " + this.properties.category,
      title: this.properties.cardtitle
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: 'https://openai.com/blog/chatgpt/'
      }
    };
  }
}
