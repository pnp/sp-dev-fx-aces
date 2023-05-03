import {
  BaseBasicCardView,
  IBasicCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'AceFormsAdaptiveCardExtensionStrings';
import { IAceFormsAdaptiveCardExtensionProps, IAceFormsAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID} from '../AceFormsAdaptiveCardExtension';

export class CardView extends BaseBasicCardView<IAceFormsAdaptiveCardExtensionProps, IAceFormsAdaptiveCardExtensionState> {
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
    

    const description = this.getCardDescription();
    
    return {
      title: this.properties.title,
      primaryText: description     
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

  private getCardDescription(){
    let description = (this.state.listTitle) ? `View items in the ${this.state.listTitle} list` : `Missing list ID or Site URL`;
    description = (this.properties.description) ? this.properties.description : description;

    return description;
  }
}
