import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'FootballStatsAdaptiveCardExtensionStrings';
import { IFootballStatsAdaptiveCardExtensionProps, IFootballStatsAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID, STANDINGS_VIEW_REGISTRY_ID } from '../FootballStatsAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<IFootballStatsAdaptiveCardExtensionProps, IFootballStatsAdaptiveCardExtensionState> {
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
      primaryText: "Football Stats ACE",
      description: "Football Stats ACE displays live standings of top five leagues from Europe"
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
