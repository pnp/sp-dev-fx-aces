import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { OfficeLocationsPropertyPane } from './OfficeLocationsPropertyPane';
import { SetupCardView } from './cardView/SetupCardView';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { DataSource, MapsSource, Office } from '../../types';
import { getOfficesFromTermStore, getOfficesFromList } from '../../officelocation.service';
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
  showMaps: boolean;
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
  offices: Office[];
  currentOfficeIndex: number;
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
        offices: null,
        currentOfficeIndex: 0,
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

  private async loadOffices(): Promise<void> {

    if (
      isEmpty(this.properties.dataSource) ||
      (this.properties.dataSource === DataSource.Local && isEmpty(this.properties.offices)) ||
      (this.properties.dataSource === DataSource.Taxonomy && isEmpty(this.properties.officesTermSetId)) ||
      (this.properties.dataSource === DataSource.List && isEmpty(this.properties.list)) ||
      isEmpty(this.properties.mapsSource) ||
      (this.properties.mapsSource === MapsSource.Bing && isEmpty(this.properties.bingMapsApiKey)) ||
      (this.properties.mapsSource === MapsSource.Google && isEmpty(this.properties.googleMapsApiKey)) ||
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

      let offices: Office[] = [];

      switch (this.properties.dataSource) {
        case DataSource.Local:
          offices = this.properties.offices;
          break;
        case DataSource.Taxonomy:
          offices = await getOfficesFromTermStore(this.properties.useSiteCollectionTermStore, this.properties.officesTermSetId);
          break;
        case DataSource.List:
          offices = await getOfficesFromList(this.properties.list);
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

      this.setState({ offices });
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

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration(this.properties, this.context, this.onPropertyPaneFieldChanged);
  }
}
