import {
  BaseBasicCardView,
  IBasicCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'AceGroupViewerAdaptiveCardExtensionStrings';
import { IAceGroupViewerAdaptiveCardExtensionProps, IAceGroupViewerAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../AceGroupViewerAdaptiveCardExtension';

export class CardView extends BaseBasicCardView<IAceGroupViewerAdaptiveCardExtensionProps, IAceGroupViewerAdaptiveCardExtensionState> {
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
      primaryText: this.state.groupName + " - Members (" + this.state.memberCount.toString() + ")",
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
