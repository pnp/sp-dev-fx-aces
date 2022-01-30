import {
  BaseBasicCardView,
  IBasicCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SecurityMonitorAdaptiveCardExtensionStrings';
import { DASBOARD_VIEW_REGISTRY_ID, ISecurityMonitorAdaptiveCardExtensionProps, ISecurityMonitorAdaptiveCardExtensionState } from '../SecurityMonitorAdaptiveCardExtension';

export class CardView extends BaseBasicCardView<ISecurityMonitorAdaptiveCardExtensionProps, ISecurityMonitorAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.QuickViewButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: DASBOARD_VIEW_REGISTRY_ID
          }
        },
        style: "default"
      }
    ];
  }

  public get data(): IBasicCardParameters {
    return {
      primaryText: strings.PrimaryText
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return;
    // {
    //   type: 'ExternalLink',
    //   parameters: {
    //     target: 'https://www.bing.com'
    //   }
    // };
  }
}
