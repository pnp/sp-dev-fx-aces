import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'OfficeLocationsAdaptiveCardExtensionStrings';
import { IOfficeLocationsAdaptiveCardExtensionProps, IOfficeLocationsAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../OfficeLocationsAdaptiveCardExtension';

export class CardView extends BaseImageCardView<IOfficeLocationsAdaptiveCardExtensionProps, IOfficeLocationsAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    if (this.state.offices && this.state.offices.length > 0) {
      return [
        {
          title: "View details",
          action: {
            type: 'QuickView',
            parameters: {
              view: QUICK_VIEW_REGISTRY_ID
            }
          }
        }
      ];
    }
  }

  public get data(): IImageCardParameters {

    if (this.state.offices === null) {
      return {
        primaryText: "Loading...",
        imageUrl: 'https://miro.medium.com/max/1000/1*J_f1db1aAuOhVY3rWVOKTA.gif',
        title: "Loading...",
        iconProperty: "Refresh"
      };
    }

    let { title } = this.properties;
    let { offices } = this.state;
    const numberOfOffices = offices?.length;
    return {
      title,
      imageUrl: this.state.mainImage || require('../assets/OfficeLocation.svg'),
      primaryText: `We have ${numberOfOffices === 0 ? 'no' : numberOfOffices} office${numberOfOffices === 1 ? '' : 's'}`
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    if (this.state.offices && this.state.offices.length > 0) {
      return {
        type: 'QuickView',
        parameters: {
          view: QUICK_VIEW_REGISTRY_ID
        }
      };
    }
  }
}
