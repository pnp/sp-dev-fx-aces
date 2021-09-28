import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'FlightItineraryAdaptiveCardExtensionStrings';
import { Reservation } from '../../../models/cg.models';
import { IFlightItineraryAdaptiveCardExtensionProps, IFlightItineraryAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../FlightItineraryAdaptiveCardExtension';

export class CardView extends BaseImageCardView<IFlightItineraryAdaptiveCardExtensionProps, IFlightItineraryAdaptiveCardExtensionState> {
  public get data(): IImageCardParameters {
    const reservation: Reservation = this.state.reservations[this.state.currentIndex];
    return {
      primaryText: `${strings.PrimaryText} ${reservation.arrivalAirport.city}`,
      imageUrl: reservation.arrivalAirport.image
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
