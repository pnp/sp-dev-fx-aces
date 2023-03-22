import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'ToDoCardAdaptiveCardExtensionStrings';
import { ADD_QUICK_VIEW_ID, IToDoCardAdaptiveCardExtensionProps, IToDoCardAdaptiveCardExtensionState, LIST_QUICK_VIEW_ID } from '../ToDoCardAdaptiveCardExtension';

export class CardView extends BaseImageCardView<IToDoCardAdaptiveCardExtensionProps, IToDoCardAdaptiveCardExtensionState> {
  /**
   * Buttons will not be visible if card size is 'Medium' with Image Card View.
   * It will support up to two buttons for 'Large' card size.
   */
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    if (this.state.items !== null && this.state.items.length > 0) {
      return [
        {
          title: strings.ListToDoQuickViewButton,
          action: {
            type: 'QuickView',
            parameters: {
              view: LIST_QUICK_VIEW_ID
            }
          }
        },
        {
          title: strings.AddToDoQuickViewButton,
          action: {
            type: 'QuickView',
            parameters: {
              view: ADD_QUICK_VIEW_ID
            }
          }
        }
      ];
    } else {
      return undefined;
    }
  }

  public get data(): IImageCardParameters {
    return {
      primaryText: this.state.description,
      imageUrl: require('../assets/ThingsToDo.png'),
      title: strings.Title
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: 'https://github.com/Azure/data-api-builder'
      }
    };
  }
}
