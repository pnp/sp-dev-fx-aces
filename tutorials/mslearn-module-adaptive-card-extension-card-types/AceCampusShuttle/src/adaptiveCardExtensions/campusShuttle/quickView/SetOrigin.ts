import {
  ISPFxAdaptiveCard,
  BaseAdaptiveCardQuickView,
  IGetLocationActionArguments
} from '@microsoft/sp-adaptive-card-extension-base';
import template from './template/SetOriginCard.json';
import {

  ICampusShuttleAdaptiveCardExtensionProps,
  ICampusShuttleAdaptiveCardExtensionState
} from '../CampusShuttleAdaptiveCardExtension';

import { ILocation, IListItem } from '../sp.service';

export interface ISetOriginData {
  title: string;
  description: string;
  trip: IListItem;
}

export class SetOrigin extends BaseAdaptiveCardQuickView<
  ICampusShuttleAdaptiveCardExtensionProps,
  ICampusShuttleAdaptiveCardExtensionState,
  ISetOriginData
> {
  public get data(): ISetOriginData {
    return {
      title: 'Set trip starting location',
      description: 'Select the trip origin location by selecting it on the map.',
      trip: this.state.currentTrip
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return template as ISPFxAdaptiveCard;
  }

  public onAction(action: IGetLocationActionArguments): void {
    if (action.type === 'VivaAction.GetLocation'){

      const currentTrip = this.state.currentTrip;
      currentTrip.OriginLocation = <ILocation> {
        latitude: action.location?.latitude,
        longitude: action.location?.longitude
      };

      this.setState({ currentTrip: currentTrip });

      this.quickViewNavigator.pop();
    }
  }
}
