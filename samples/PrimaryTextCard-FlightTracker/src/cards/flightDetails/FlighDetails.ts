import {
  BaseAdaptiveCardView,
  IActionArguments,
  ISPFxAdaptiveCard,
} from '@microsoft/sp-adaptive-card-extension-base';

import {
  IFlightTrackerAdaptiveCardExtensionProps,
  IFlightTrackerAdaptiveCardExtensionState,
} from '../../models';
import { IFlightDetailsData } from '../../models/IFlightDetailsData';

export class QuickView extends BaseAdaptiveCardView<
  IFlightTrackerAdaptiveCardExtensionProps,
  IFlightTrackerAdaptiveCardExtensionState,
  IFlightDetailsData
> {
  public get data(): IFlightDetailsData {
    const { mappedData } = this.state;
    return { ...mappedData };
  }

  public get template(): ISPFxAdaptiveCard {
    return require("./template/FlightDetailsTemplate.json");
  }

  public onAction(action: IActionArguments): void {
    const { intervalTimer, mappedData } = this.state;

    if (action.type === "Submit") {
      const { id } = action ;
      switch (id) {
        case "StartLiveUpdates":
          this.setState({
            startTimer: true,
            mappedData: {...mappedData, liveUpdatesON: true}
          } );
          intervalTimer.startTimer(true);
          break;
        case "StopLiveUpdates":
          this.setState({
            startTimer: false,
            mappedData: {...mappedData, liveUpdatesON: false}
          });
          intervalTimer.startTimer(false);
          break;
      }
    }
  }
}
