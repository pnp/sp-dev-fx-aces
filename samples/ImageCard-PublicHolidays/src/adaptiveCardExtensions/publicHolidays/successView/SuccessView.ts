import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { IPublicHolidaysAdaptiveCardExtensionProps, IPublicHolidaysAdaptiveCardExtensionState } from '../PublicHolidaysAdaptiveCardExtension';
import PublicHolidaysService from '../../../services/PublicHolidaysService';
import { IPublicHoliday } from '../../../models/IPublicHoliday';
import * as strings from 'PublicHolidaysAdaptiveCardExtensionStrings';

export interface ISuccessViewData {
  subTitle: string;
  title: string;
  description: string;
}

export class SuccessView extends BaseAdaptiveCardView<
  IPublicHolidaysAdaptiveCardExtensionProps,
  IPublicHolidaysAdaptiveCardExtensionState, ISuccessViewData> {
  public get data(): ISuccessViewData {
    return {
      subTitle: strings.LocationUpdatedSuccessText,
      title: '',
      description: '',
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/SuccessViewTemplate.json');
  }

  public onAction(action: IActionArguments): void {
    if (action.id === 'close') {
      if (this.state.isLocationUpdated || !this.state.areHolidaysLoaded) {
        PublicHolidaysService.getOfficeLocation(this.state.userProfileProperty)
          .then((currentLocation: string) => {
            PublicHolidaysService.getUpcomingPublicHolidays(this.state.listGUID, this.state.limitToDate, currentLocation, 1)
              .then((holidays: IPublicHoliday[]) => {
                this.setState({
                  ...this.state,
                  isLocationUpdated: false,
                  areHolidaysLoaded: false,
                  officeLocation: currentLocation,
                  upcomingHolidays: holidays
                });
              })
              .catch((error: Error) => {
                console.error('Error: ', error);
                throw error;
              });
              
            this.quickViewNavigator.close();
          })
          .catch((error: Error) => {
            console.error('Error: ', error);
            throw error;
          });
      }
    }
  }
}