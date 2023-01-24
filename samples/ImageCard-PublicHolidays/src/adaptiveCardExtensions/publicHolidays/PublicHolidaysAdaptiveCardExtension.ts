import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { LoadingView } from './loadingView/LoadingView';
import { SuccessView } from './successView/SuccessView';
import { ErrorView } from './errorView/ErrorView';
import { PublicHolidaysPropertyPane } from './PublicHolidaysPropertyPane';
import PublicHolidaysService from '../../services/PublicHolidaysService';
import { IPublicHoliday } from '../../models/IPublicHoliday';
import { IAvailableLocation } from "../../models/IAvailableLocation";
import { IDateTimeFieldValue } from "@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker";
import { ErrorCardView } from './cardView/ErrorCardView';
import { SetupCardView } from './cardView/SetupCardView';

export interface IPublicHolidaysAdaptiveCardExtensionProps {
  title: string;
  listTitle: string;
  userProfileProperty: string;
  limitToDate: IDateTimeFieldValue;
}

export interface IPublicHolidaysAdaptiveCardExtensionState {
  userProfileProperty: string;
  availableLocations: IAvailableLocation;
  officeLocation: string;
  isLocationUpdated: boolean;
  areHolidaysLoaded: boolean;
  limitToDate: IDateTimeFieldValue;
  listGUID: string;
  listURL: string;
  upcomingHolidays: IPublicHoliday[];
}

const CARD_VIEW_REGISTRY_ID: string = 'PublicHolidays_CARD_VIEW';
const ERROR_CARD_VIEW_REGISTRY_ID: string = 'PublicHolidays_ERROR_CARD_VIEW';
const CARD_VIEW_SETUP_ID: string = 'PublicHolidays_Setup_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'PublicHolidays_QUICK_VIEW';
export const LOADING_VIEW_REGISTRY_ID: string = 'PublicHolidays_LOADING_VIEW';
export const SUCCESS_VIEW_REGISTRY_ID: string = 'PublicHolidays_SUCCESS_VIEW';
export const ERROR_VIEW_REGISTRY_ID: string = 'PublicHolidays_ERROR_VIEW';

export default class PublicHolidaysAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IPublicHolidaysAdaptiveCardExtensionProps,
  IPublicHolidaysAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: PublicHolidaysPropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      upcomingHolidays: [],
      officeLocation: "",
      isLocationUpdated: false,
      areHolidaysLoaded: false,
      userProfileProperty: this.properties.userProfileProperty,
      limitToDate: this.properties.limitToDate,
      listGUID: this.properties.listTitle,
      availableLocations: { listTitle: "", items: [] },
      listURL: this.context.pageContext.site.absoluteUrl + "/Lists/"
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.cardNavigator.register(ERROR_CARD_VIEW_REGISTRY_ID, () => new ErrorCardView());
    this.cardNavigator.register(CARD_VIEW_SETUP_ID, () => new SetupCardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    this.quickViewNavigator.register(LOADING_VIEW_REGISTRY_ID, () => new LoadingView());
    this.quickViewNavigator.register(ERROR_VIEW_REGISTRY_ID, () => new ErrorView());
    this.quickViewNavigator.register(SUCCESS_VIEW_REGISTRY_ID, () => new SuccessView());

    PublicHolidaysService.setup(this.context);

    await this._loadCardInfo(this.properties.listTitle, this.properties.userProfileProperty, this.properties.limitToDate);
    return Promise.resolve();
  }

  private async _loadCardInfo(listGUID: string, userProfileProperty: string, limitToDate: IDateTimeFieldValue): Promise<void> {
    setTimeout(async () => {
      if (isEmpty(this.properties.listTitle)) {
        this.cardNavigator.replace(CARD_VIEW_SETUP_ID);
        return;
      }

      const currentLocation: string = await PublicHolidaysService.getOfficeLocation(userProfileProperty);

      PublicHolidaysService.getAvailableLocations(listGUID).then((availableLocations) => {
        const listURLWithFilter: string = `${this.state.listURL}${availableLocations.listTitle}/AllItems.aspx?FilterField1=OfficeLocation&FilterValue1=${currentLocation}`;

        this.setState({
          availableLocations: availableLocations,
          listURL: listURLWithFilter
        });
      })
        .catch((error) => {
          this.cardNavigator.replace(ERROR_CARD_VIEW_REGISTRY_ID);
          return;
        });

      PublicHolidaysService.getUpcomingPublicHolidays(listGUID, limitToDate, currentLocation, 1)
        .then((holidays: IPublicHoliday[]) => {
          this.setState({
            ...this.state,
            userProfileProperty: userProfileProperty,
            upcomingHolidays: holidays,
            officeLocation: currentLocation,
            isLocationUpdated: false,
            areHolidaysLoaded: false,
            limitToDate: limitToDate,
            listGUID: listGUID
          });

          this.cardNavigator.replace(CARD_VIEW_REGISTRY_ID);
          return Promise.resolve();
        })
        .catch((error) => {
          this.cardNavigator.replace(ERROR_CARD_VIEW_REGISTRY_ID);
          this.setState({
            ...this.state,
            upcomingHolidays: []
          });

          return;
        });
    });
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'PublicHolidays-property-pane'*/
      './PublicHolidaysPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.PublicHolidaysPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration(this.properties, this.context, this.onPropertyPaneFieldChanged.bind(this));
  }

  protected async onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): Promise<void> {
    if (newValue !== oldValue) {
      if (propertyPath === "limitToDate") {
        await this._loadCardInfo(this.properties.listTitle, this.properties.userProfileProperty, newValue);
      }
      else if (propertyPath === "listTitle") {
        await this._loadCardInfo(newValue, this.properties.userProfileProperty, this.properties.limitToDate);
      }
      else if (propertyPath === "userProfileProperty") {
        await this._loadCardInfo(this.properties.listTitle, newValue, this.properties.limitToDate);
      }
    }
  }
}
