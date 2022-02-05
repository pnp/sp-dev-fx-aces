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
    const riskCount = this.state.riskData ? this.state.riskData.length : 0;
    const userCount = this.state.userData ? this.state.userData.length : 0;
    const primaryText = strings.PrimaryText.replace("{riskNo}", riskCount.toString());
    return {
      primaryText: primaryText.replace("{userNo}", userCount.toString())
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
