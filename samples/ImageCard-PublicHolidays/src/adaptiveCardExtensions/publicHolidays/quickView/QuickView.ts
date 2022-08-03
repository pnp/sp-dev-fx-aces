import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import {
  IPublicHolidaysAdaptiveCardExtensionProps,
  IPublicHolidaysAdaptiveCardExtensionState,
  ERROR_VIEW_REGISTRY_ID,
  SUCCESS_VIEW_REGISTRY_ID
} from '../PublicHolidaysAdaptiveCardExtension';
import { IPublicHoliday } from '../../../models/IPublicHoliday';
import PublicHolidaysService from '../../../services/PublicHolidaysService';
import { IAvailableLocation } from "../../../models/IAvailableLocation";

export interface IQuickViewData {
  currentLocation: string;
  upcomingHolidays: IPublicHoliday[];
  availableLocations: IAvailableLocation;
}

export class QuickView extends BaseAdaptiveCardView<
  IPublicHolidaysAdaptiveCardExtensionProps,
  IPublicHolidaysAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    if (this.state.isLocationUpdated || !this.state.areHolidaysLoaded) {
      PublicHolidaysService.getOfficeLocation(this.state.userProfileProperty)
        .then((currentLocation: string) => {
          PublicHolidaysService.getUpcomingPublicHolidays(this.state.listGUID, this.state.limitToDate, currentLocation)
            .then((holidays: IPublicHoliday[]) => {
              this.setState({
                ...this.state,
                isLocationUpdated: false,
                areHolidaysLoaded: true,
                officeLocation: currentLocation,
                upcomingHolidays: holidays
              });
            })
            .catch((error) => {
              this.quickViewNavigator.push(ERROR_VIEW_REGISTRY_ID);
              this.setState({
                ...this.state,
                isLocationUpdated: false,
                areHolidaysLoaded: false
              });
            });
        })
        .catch((error) => {
          this.quickViewNavigator.push(ERROR_VIEW_REGISTRY_ID);
          this.setState({
            ...this.state,
            isLocationUpdated: false,
            areHolidaysLoaded: false
          });
        });
    }

    return {
      currentLocation: this.state.officeLocation,
      availableLocations: this.state.availableLocations,
      upcomingHolidays: (this.state.upcomingHolidays.length >= 1 ? this.state.upcomingHolidays.slice(1) : this.state.upcomingHolidays)
    };
  }

  public async onAction(action: IActionArguments): Promise<void> {
    try {
      if (action.type === 'Submit') {
        PublicHolidaysService.updateOfficeLocation(this.state.userProfileProperty, action.data.newLocation).then(() => {
          this.quickViewNavigator.push(SUCCESS_VIEW_REGISTRY_ID);
          this.setState({
            ...this.state,
            isLocationUpdated: true
          });
        })
          .catch((error) => {
            this.quickViewNavigator.push(ERROR_VIEW_REGISTRY_ID);
            this.setState({
              ...this.state,
              isLocationUpdated: false
            });
          });
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}