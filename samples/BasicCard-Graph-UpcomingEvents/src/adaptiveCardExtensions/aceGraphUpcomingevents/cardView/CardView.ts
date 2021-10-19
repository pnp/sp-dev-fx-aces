import {
  BaseBasicCardView,
  IBasicCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'AceGraphUpcomingeventsAdaptiveCardExtensionStrings';
import { IAceGraphUpcomingeventsAdaptiveCardExtensionProps, IAceGraphUpcomingeventsAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../AceGraphUpcomingeventsAdaptiveCardExtension';

export class CardView extends BaseBasicCardView<IAceGraphUpcomingeventsAdaptiveCardExtensionProps, IAceGraphUpcomingeventsAdaptiveCardExtensionState> {

  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    if(this.state.eventCount !== 0){
      return [
        {
          title: "View Events",
          action: {
            type: 'QuickView',
            parameters: {
              view: QUICK_VIEW_REGISTRY_ID
            }
          }
        }
      ];
    } else {
      return null;
    }
  }

  public get data(): IBasicCardParameters {
    let cardText: string = "";
    if(this.state.eventCount === 0){
      cardText = "No Upcoming Events";
    } else {
      cardText = this.state.eventCount.toString() + " Upcoming Event(s)";
    }
    return {
      primaryText: cardText,
    };
  }

  // public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
  //   return {
  //     type: 'ExternalLink',
  //     parameters: {
  //       target: 'https://outlook.office.com/calendar'
  //     }
  //   };
  // }
}
