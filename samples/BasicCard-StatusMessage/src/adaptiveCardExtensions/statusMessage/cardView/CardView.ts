import {
  BaseBasicCardView,
  IBasicCardParameters,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'StatusMessageAdaptiveCardExtensionStrings';
import { IStatusMessageAdaptiveCardExtensionProps, IStatusMessageAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../StatusMessageAdaptiveCardExtension';

export class CardView extends BaseBasicCardView<IStatusMessageAdaptiveCardExtensionProps, IStatusMessageAdaptiveCardExtensionState> {
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

  public get data(): IBasicCardParameters {
    return {
      primaryText: this.state.currentStatusMessage,
      title: this.properties.title
    };
  }
}
