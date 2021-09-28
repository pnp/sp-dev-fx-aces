import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { IWeatherAdaptiveCardExtensionProps, IWeatherAdaptiveCardExtensionState } from '../WeatherAdaptiveCardExtension';

import { Logger, LogLevel } from "@pnp/logging";

import { Location } from '../../../models/cg.models';

export interface IQuickViewData {
  location: Location;
  date: string;
}

export class QuickView extends BaseAdaptiveCardView<
  IWeatherAdaptiveCardExtensionProps,
  IWeatherAdaptiveCardExtensionState,
  IQuickViewData
> {
  private LOG_SOURCE: string = "🔶 QuickView";
  public get data(): IQuickViewData {
    const location: Location = this.state.locations[this.state.currentLocationId];
    const date = new Date();
    return {
      location: location,
      date: new Date().toUTCString()
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
  public async onAction(action: IActionArguments): Promise<void> {
    try {
      if (action.type === 'Submit') {
        const { id, newIndex } = action.data;
        if (id === 'previous') {
          let idx = this.state.locations[this.state.currentLocationId].id;
          let newViewId: number = this.state.currentLocationId;
          idx--;
          if (idx < 0) {
            newViewId = this.state.locations[this.state.locations.length - 1].id;
          } else {
            newViewId = this.state.locations[idx].id;
          }
          this.setState({ currentLocationId: newViewId });
        } else if (id === 'next') {
          let idx = this.state.locations[this.state.currentLocationId].id;
          let newViewId: number = this.state.currentLocationId;
          idx++;
          if (idx < this.state.locations.length) {
            newViewId = this.state.locations[idx].id;
          } else {
            newViewId = this.state.locations[0].id;
          }
          this.setState({ currentLocationId: newViewId });
        }
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onAction) - ${err}`, LogLevel.Error);
    }
  }
}