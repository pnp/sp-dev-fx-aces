/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseAdaptiveCardExtension,
  ICacheSettings,
} from '@microsoft/sp-adaptive-card-extension-base';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';

import { QuickView } from '../../cards/flightDetails/FlighDetails';
import { EProcessStatus } from '../../constants/EProcessStatus';
import {
  IFlightTrackerAdaptiveCardExtensionProps,
} from '../../models/IFlightTrackerAdaptiveCardExtensionProps';
import {
  IFlightTrackerAdaptiveCardExtensionState,
} from '../../models/IFlightTrackerAdaptiveCardExtensionState';
import { getFlightDetails } from '../../services/services';
import { IntervalTimer } from '../../utils/IntervalTimer';
import { mapData } from '../../utils/utils';
import { CardView } from './cardView/CardView';
import { FlightTrackerPropertyPane } from './FlightTrackerPropertyPane';

const CARD_VIEW_REGISTRY_ID: string = "FlightTracker_CARD_VIEW";
export const QUICK_VIEW_REGISTRY_ID: string = "FlightTracker_QUICK_VIEW";

export default class FlightTrackerAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IFlightTrackerAdaptiveCardExtensionProps,
  IFlightTrackerAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: FlightTrackerPropertyPane | undefined;
  private interval: IntervalTimer = undefined;
  private delay: number = 60000;
  public async onInit(): Promise<void> {
    const { refreshInterval } = this.properties;
    this.delay = refreshInterval ? refreshInterval * 60000 : 60000;

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    this.interval = new IntervalTimer(this.getFlight.bind(this), this.delay);
    this.state = { intervalTimer: this.interval, startTimer: false } as IFlightTrackerAdaptiveCardExtensionState;
    this.interval.startTimer(this.properties.flightNumber ? true : false);

    this.setState({ processStatus: EProcessStatus.LOADING });
    setTimeout(async () => {
      await this.getFlight();
    }, 400);

    return Promise.resolve();
  }

  protected getCacheSettings(): Partial<ICacheSettings> {
    return {
      isEnabled: false,
      expiryTimeInSeconds: 5000,
      cachedCardView: () => new CardView(),
    };
  }

  protected getFlight = async () => {
    const { flightNumber } = this.properties;

    if (!flightNumber) {
      this.setState({ processStatus: EProcessStatus.NO_FLIGHT_NUMBER });
      return;
    }

    try {
      const flightInfo = await getFlightDetails(flightNumber);
      if (flightInfo) {
      const enableTimer = this.getEnableTimer(flightInfo.status);
      const mappedData = await mapData(flightInfo, enableTimer);

      this.setState({
        startTimer: enableTimer,
        processStatus: EProcessStatus.SUCCESS,
        flightDetails: flightInfo,
        mappedData: mappedData,
      });
    } else {
      this.setState({ processStatus: EProcessStatus.NO_FLIGHT_INFO});
      this.interval.startTimer(false);
    }
    } catch (error) {
      this.setState({ processStatus: EProcessStatus.ERROR, error: error.message });
    }
  };

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'FlightTracker-property-pane'*/
      "./FlightTrackerPropertyPane"
    ).then((component) => {
      this._deferredPropertyPane = new component.FlightTrackerPropertyPane(this.properties);
    });
  }

  protected onPropertyPaneFieldChanged = async (propertyPath: string, oldValue: any, newValue: any) => {
    if (propertyPath === "flightNumber" && newValue !== oldValue) {
      this.interval.startTimer(false);
      await this.getFlight();
      this.interval.startTimer(true);
    }

    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  };
  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }

  protected getEnableTimer = (flighStatus: string): boolean => {
    if (flighStatus !== "Arrived" && flighStatus !== "Cancelled") {
      return true;
    } else {
      this.interval.startTimer(false);
    }
    return false;
  };
}
