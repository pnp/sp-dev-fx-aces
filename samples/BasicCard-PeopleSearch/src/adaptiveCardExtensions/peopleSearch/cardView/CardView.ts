import {
  BaseBasicCardView,
  IBasicCardParameters,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PeopleSearchAdaptiveCardExtensionStrings';
import { IPeopleSearchAdaptiveCardExtensionProps, IPeopleSearchAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../PeopleSearchAdaptiveCardExtension';

export class CardView extends BaseBasicCardView<IPeopleSearchAdaptiveCardExtensionProps, IPeopleSearchAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: this.properties.cardButtonText,
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
      primaryText: this.properties.cardText,
      title: this.properties.title,
      iconProperty: !!this.properties.iconProperty ? this.properties.iconProperty : require('../assets/People.svg')
    };
  }
}
