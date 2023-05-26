import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'LibraryAdaptiveCardExtensionStrings';
import { ILibraryAdaptiveCardExtensionProps, ILibraryAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../LibraryAdaptiveCardExtension';

export class CardView extends BaseImageCardView<ILibraryAdaptiveCardExtensionProps, ILibraryAdaptiveCardExtensionState> {
  /**
   * Buttons will not be visible if card size is 'Medium' with Image Card View.
   * It will support up to two buttons for 'Large' card size.
   */
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

  public get data(): IImageCardParameters {
    return {
      primaryText: strings.PrimaryText,
      imageUrl: require('../assets/library.png'),
      title: this.properties.title
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
