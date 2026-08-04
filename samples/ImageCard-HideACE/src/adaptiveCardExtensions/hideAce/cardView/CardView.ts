import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'HideAceAdaptiveCardExtensionStrings';
import { IHideAceAdaptiveCardExtensionProps, IHideAceAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../HideAceAdaptiveCardExtension';

export class CardView extends BaseImageCardView<IHideAceAdaptiveCardExtensionProps, IHideAceAdaptiveCardExtensionState> {
  // Guards against re-entrant renders: setVisibility() triggers a re-render which
  // re-invokes the data getter, so it must only be called once.
  private _visibilityApplied = false;

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
    // Hide the ACE when the user has registered. setVisibility is only available on the
    // card view; the guard prevents the re-render it triggers from recursing.
    if (this.state.hideCard && !this._visibilityApplied) {
      this._visibilityApplied = true;
      this.setVisibility(false);
    }
    return {
      primaryText: strings.PrimaryText,
      imageUrl: require('../assets/events.png'),
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
