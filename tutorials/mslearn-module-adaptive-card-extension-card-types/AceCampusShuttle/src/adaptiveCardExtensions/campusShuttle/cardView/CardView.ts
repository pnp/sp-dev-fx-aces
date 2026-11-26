import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  PrimaryTextCardView,
  CardViewActionsFooterConfiguration
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'CampusShuttleAdaptiveCardExtensionStrings';
import {
  ICampusShuttleAdaptiveCardExtensionProps,
  ICampusShuttleAdaptiveCardExtensionState,
  QUICK_VIEW_START_TRIP_REGISTRY_ID,
  QUICK_VIEW_UPDATE_TRIP_REGISTRY_ID,
  QUICK_VIEW_COMPLETE_TRIP_REGISTRY_ID
} from '../CampusShuttleAdaptiveCardExtension';
import {
  ILocation,
  STATUS_AVAILABLE,
  STATUS_ENROUTE,
  STATUS_HIRED
} from '../sp.service';

export class CardView extends BaseComponentsCardView<
  ICampusShuttleAdaptiveCardExtensionProps,
  ICampusShuttleAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    let footer: CardViewActionsFooterConfiguration;

    switch (this.state.currentTrip.Status) {
      case STATUS_AVAILABLE:
        footer = {
          componentName: 'cardButton',
          title: 'Book a Trip',
          action: {
            type: 'QuickView',
            parameters: { view: QUICK_VIEW_START_TRIP_REGISTRY_ID }
          }
        };
        break;
      case STATUS_ENROUTE:
        footer = [
          {
            componentName: 'cardButton',
            title: 'View pickup location',
            action: {
              type: 'VivaAction.ShowLocation',
              parameters: {
                locationCoordinates: {
                  latitude: (this.state.currentTrip.OriginLocation as ILocation).latitude,
                  longitude: (this.state.currentTrip.OriginLocation as ILocation).longitude
                }
              }
            }
          },
          {
            componentName: 'cardButton',
            title: 'Update Trip',
            action: {
              type: 'QuickView',
              parameters: { view: QUICK_VIEW_UPDATE_TRIP_REGISTRY_ID }
            }
          }
        ];
        break;
      case STATUS_HIRED:
        footer = [
          {
            componentName: 'cardButton',
            title: 'View dropoff location',
            action: {
              type: 'VivaAction.ShowLocation',
              parameters: {
                locationCoordinates: {
                  latitude: (this.state.currentTrip.DestinationLocation as ILocation).latitude,
                  longitude: (this.state.currentTrip.DestinationLocation as ILocation).longitude
                }
              }
            }
          },
          {
            componentName: 'cardButton',
            title: 'Complete Trip',
            action: {
              type: 'QuickView',
              parameters: { view: QUICK_VIEW_COMPLETE_TRIP_REGISTRY_ID }
            }
          }
        ];
        break;
      default:
        footer = undefined;
        break;
    }

    return PrimaryTextCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title
      },
      header: {
        componentName: 'text',
        text: strings.PrimaryText
      },
      body: {
        componentName: 'text',
        text: (this.state.currentTrip.Status === STATUS_AVAILABLE)
          ? `available for hire`
          : (this.state.currentTrip.Status === STATUS_ENROUTE)
            ? `Booked - ${STATUS_ENROUTE} to pickup...`
            : (this.state.currentTrip.DestinationName)
              ? `Hired - driving passenger to ${this.state.currentTrip.DestinationName}...`
              : `Hired - driving passenger to destination...`
      },
      footer
    });
  }
}
