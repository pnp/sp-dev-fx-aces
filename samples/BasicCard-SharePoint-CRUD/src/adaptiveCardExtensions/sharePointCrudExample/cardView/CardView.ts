import {
  BaseBasicCardView,
  IBasicCardParameters,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SharePointCrudExampleAdaptiveCardExtensionStrings';
import { ISharePointCrudExampleAdaptiveCardExtensionProps, ISharePointCrudExampleAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../SharePointCrudExampleAdaptiveCardExtension';

export class CardView extends BaseBasicCardView<ISharePointCrudExampleAdaptiveCardExtensionProps, ISharePointCrudExampleAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.ViewItems,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      },
      {
        title: strings.AddItem,
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
    const cardText: string = `${strings.PrimaryText.replace("_xxx_", this.state.items.length.toString())} ${this.properties.description}`;

    return {
      primaryText: cardText
    };
  }
}
