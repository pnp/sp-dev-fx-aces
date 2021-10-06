import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';

import { Logger, LogLevel } from "@pnp/logging";

import * as strings from 'FlightItineraryAdaptiveCardExtensionStrings';
import { Reservation } from '../../../models/cg.models';
import { IFlightItineraryAdaptiveCardExtensionProps, IFlightItineraryAdaptiveCardExtensionState } from '../FlightItineraryAdaptiveCardExtension';

export interface IQuickViewData {
  reservation: Reservation;
  viewLabel: string;
}

export class QuickView extends BaseAdaptiveCardView<
  IFlightItineraryAdaptiveCardExtensionProps,
  IFlightItineraryAdaptiveCardExtensionState,
  IQuickViewData
> {
  private LOG_SOURCE: string = "🔶 QuickView";
  public get data(): IQuickViewData {
    const reservation: Reservation = this.state.reservations[this.state.currentIndex];
    return {
      reservation: reservation,
      viewLabel: strings.ViewLabel
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
  public async onAction(action: IActionArguments): Promise<void> {
    try {
      if (action.type === 'Submit') {
        const { id, newIndex } = action.data;
        if (id === 'checkin') {
          //Put your checkin logic here.
          this.quickViewNavigator.close();
        }
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onAction) - ${err}`, LogLevel.Error);
    }

  }
}