import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension, BaseCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { OfficeLocationsPropertyPane } from './OfficeLocationsPropertyPane';
import { SetupCardView } from './cardView/SetupCardView';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { DataSource, MapsSource, Office } from '../../types';
import { getOfficesFromTermStore, getOfficesFromList, PLACEHOLDER_IMAGE_URL } from '../../officelocation.service';
import { sp } from "@pnp/sp/presets/all";
import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { ErrorCardView } from './cardView/ErrorCardView';

export interface IOfficeLocationsAdaptiveCardExtensionProps {
  title: string;
  iconProperty: string;
  mainImage: string;
  dataSource: DataSource;
  offices: Office[];
  useSiteCollectionTermStore: boolean;
  officesTermSetId: string;
  list: string;
  showSearch: boolean;
  showMapsInQuickView: boolean;
  mapsSource: MapsSource;
  useMapsAPI: boolean;
  bingMapsApiKey: string;
  googleMapsApiKey: string;
  showTime: boolean;
  showWeather: boolean;
  getWeatherFromList: boolean;
  weatherList: string;
  openWeatherMapApiKey: string;
}

export interface IOfficeLocationsAdaptiveCardExtensionState {
  mainImage: string;
  offices: Office[];
  currentOfficeIndex: number;
  searchText: string;
  cardViewToRender: string;
  errorMessage: string;
}

const CARD_VIEW_REGISTRY_ID: string = 'OfficeLocations_CARD_VIEW';
const SETUP_CARD_VIEW_REGISTRY_ID: string = 'OfficeLocations_SETUP_CARD_VIEW';
const ERROR_CARD_VIEW_REGISTRY_ID: string = 'OfficeLocations_ERROR_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'OfficeLocations_QUICK_VIEW';

export default class OfficeLocationsAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IOfficeLocationsAdaptiveCardExtensionProps,
  IOfficeLocationsAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: OfficeLocationsPropertyPane | undefined;
  private LOG_SOURCE: string = "🔶 OfficeLocationsAdaptiveCardExtension";

  public async onInit(): Promise<void> {

    try {
      Logger.subscribe(new ConsoleListener());
      Logger.activeLogLevel = LogLevel.Info;

      sp.setup({
        spfxContext: this.context
      });

      this.state = {
        mainImage: this.properties.mainImage,
        offices: null,
        currentOfficeIndex: 0,
        searchText: '',
        cardViewToRender: CARD_VIEW_REGISTRY_ID,
        errorMessage: ''
      };

      this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
      this.cardNavigator.register(SETUP_CARD_VIEW_REGISTRY_ID, () => new SetupCardView());
      this.cardNavigator.register(ERROR_CARD_VIEW_REGISTRY_ID, () => new ErrorCardView());
      this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

      await this.loadOffices();
      return Promise.resolve();

    } catch (error) {
      Logger.write(`${this.LOG_SOURCE} (onInit) - ${error.message} - `, LogLevel.Error);
    }
  }

  /* public getCachedState(state: IOfficeLocationsAdaptiveCardExtensionState): Partial<IOfficeLocationsAdaptiveCardExtensionState> {
    console.log("getCachedState - %o", state);
    return {
      offices: state.offices
    }
  } */

  private loadOffices = async (): Promise<void> => {

    if (
      isEmpty(this.properties.dataSource) ||
      (this.properties.dataSource === DataSource.Local && isEmpty(this.properties.offices)) ||
      (this.properties.dataSource === DataSource.Taxonomy && isEmpty(this.properties.officesTermSetId)) ||
      (this.properties.dataSource === DataSource.List && isEmpty(this.properties.list)) ||
      (this.properties.showMapsInQuickView && isEmpty(this.properties.mapsSource)) ||
      (this.properties.showMapsInQuickView && this.properties.useMapsAPI && this.properties.mapsSource === MapsSource.Bing && isEmpty(this.properties.bingMapsApiKey)) ||
      (this.properties.showMapsInQuickView && this.properties.useMapsAPI && this.properties.mapsSource === MapsSource.Google && isEmpty(this.properties.googleMapsApiKey)) ||
      (this.properties.showWeather && this.properties.getWeatherFromList && isEmpty(this.properties.weatherList)) ||
      (this.properties.showWeather && !this.properties.getWeatherFromList && isEmpty(this.properties.openWeatherMapApiKey))
    ) {
      this.setState({
        cardViewToRender: SETUP_CARD_VIEW_REGISTRY_ID
      });
      this.cardNavigator.replace(this.state.cardViewToRender);
      return;
    }

    setTimeout(async () => {

      let offices: Office[] = null;

      switch (this.properties.dataSource) {
        case DataSource.Local:
          offices = this.properties.offices;
          break;
        case DataSource.Taxonomy:
          offices = await getOfficesFromTermStore(this.properties.useSiteCollectionTermStore, this.properties.officesTermSetId);
          break;
        case DataSource.List:
          offices = isEmpty(this.properties.list) ? null : await getOfficesFromList(this.properties.list);
          break;
      }

      if (offices === null) {
        this.setState({
          cardViewToRender: ERROR_CARD_VIEW_REGISTRY_ID,
          errorMessage: "Please check logs"
        });
        this.cardNavigator.replace(this.state.cardViewToRender);
        return;
      }

      this.setState({
        offices,
        cardViewToRender: CARD_VIEW_REGISTRY_ID
      });
      this.cardNavigator.replace(this.state.cardViewToRender);
    }, 300);
  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/OfficeLocation.svg');
  }

  protected get dataSource(): DataSource {
    return this.properties.dataSource;
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'OfficeLocations-property-pane'*/
      './OfficeLocationsPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.OfficeLocationsPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return this.state.cardViewToRender;
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (propertyPath === 'mainImage' && newValue !== oldValue) {
      if (newValue) {
        this.setState({
          mainImage: newValue
        });
      }
    }

    if ((propertyPath === 'dataSource' ||
      propertyPath === 'officesTermSetId' ||
      propertyPath === 'list' ||
      propertyPath === 'offices') && newValue !== oldValue) {
      if (newValue) {
        this.loadOffices();
      } else {
        this.setState({
          offices: null,
          cardViewToRender: SETUP_CARD_VIEW_REGISTRY_ID
        });
        this.cardNavigator.replace(this.state.cardViewToRender);
      }
    }

  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration(this.properties, this.context, this.onPropertyPaneFieldChanged.bind(this));
  }
}
