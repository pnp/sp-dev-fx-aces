import {
  BaseAdaptiveCardQuickView,
  IActionArguments,
  ISPFxAdaptiveCard
 } from '@microsoft/sp-adaptive-card-extension-base';
import template from './template/SaveTripCard.json';
import {
  ICampusShuttleAdaptiveCardExtensionProps,
  ICampusShuttleAdaptiveCardExtensionState
} from '../CampusShuttleAdaptiveCardExtension';

export interface ISaveTripData {
  title: string;
}

export class SaveTrip extends BaseAdaptiveCardQuickView<
  ICampusShuttleAdaptiveCardExtensionProps,
  ICampusShuttleAdaptiveCardExtensionState,
  ISaveTripData
> {
  public get data(): ISaveTripData {
    return {
      title: 'Trip saved successfully.'
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return template as ISPFxAdaptiveCard;
  }

  public onAction(action: IActionArguments): void {
    if (action.id === 'close') {
      this.quickViewNavigator.close();
    }
  }
}
