import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PublicHolidaysAdaptiveCardExtensionStrings';
import { IPublicHolidaysAdaptiveCardExtensionProps, IPublicHolidaysAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../PublicHolidaysAdaptiveCardExtension';
import { isEmpty } from '@microsoft/sp-lodash-subset';

export class CardView extends BaseImageCardView<IPublicHolidaysAdaptiveCardExtensionProps, IPublicHolidaysAdaptiveCardExtensionState> {
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
    if (isEmpty(this.state.officeLocation)) {
      return {
        title: strings.PrimaryText,
        primaryText: 'Please set your office location first!',
        imageUrl: require('../assets/PublicHoliday.jpg')
      };
    }

    if (this.state.upcomingHolidays.length > 0) {
      return {
        title: strings.PrimaryText,
        primaryText: `${this.state.upcomingHolidays[0].Title} ${strings.NextHolidayText} ${this.state.upcomingHolidays[0].DateValue}`,
        imageUrl: this.state.upcomingHolidays[0].ImageValue
      };
    }
    else {
      return {
        title: strings.PrimaryText,
        primaryText: 'There are no upcoming holidays at your location!!!',
        imageUrl: require('../assets/PublicHoliday.jpg')
      };
    }
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: this.state.listURL
      }
    };
  }
}
