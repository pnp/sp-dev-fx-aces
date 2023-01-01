import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'MyHolidaysAdaptiveCardExtensionStrings';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { IMyHolidaysAdaptiveCardExtensionProps, IMyHolidaysAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../MyHolidaysAdaptiveCardExtension';

export class CardView extends BaseImageCardView<IMyHolidaysAdaptiveCardExtensionProps, IMyHolidaysAdaptiveCardExtensionState> {
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
    const upcomingHoliday=!isEmpty(this.state.upcomingHoliday)?this.state.upcomingHoliday.name +" "+this.state.upcomingHoliday.date.iso:"View Holiday";
    return {
      primaryText: upcomingHoliday,
      imageUrl: require('../assets/upcomingHoliday.png'),
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
