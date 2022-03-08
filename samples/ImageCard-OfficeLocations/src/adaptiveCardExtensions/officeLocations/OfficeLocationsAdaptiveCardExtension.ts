import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension, BaseCardView, RenderType } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { OfficeLocationsPropertyPane } from './OfficeLocationsPropertyPane';
import { SetupCardView } from './cardView/SetupCardView';
import { isEmpty, sortBy } from '@microsoft/sp-lodash-subset';
import { DataSource, MapsSource, Office } from '../../types';
import { getSP } from '../../officelocation.service';
import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { ErrorCardView } from './cardView/ErrorCardView';
import { ListView } from './listView/ListView';
import { SPFI } from '@pnp/sp';

export interface IOfficeLocationsAdaptiveCardExtensionProps {
  title: string;
  iconProperty: string;
  mainImage: string;
  showQuickViewAsList: boolean;
  dataSource: DataSource;
  offices: Office[];
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
  loadingImage: string;
  getWeatherFromList: boolean;
  weatherList: string;
  openWeatherMapApiKey: string;
  fuse: any;
}

export interface IOfficeLocationsAdaptiveCardExtensionState {
  mainImage: string;
  offices: Office[];
  filteredOffices: Partial<Office>[];
  currentOfficeIndex: number;
  searchText: string;
  cardViewToRender: string;
  errorMessage: string;
}

const CARD_VIEW_REGISTRY_ID: string = 'OfficeLocations_CARD_VIEW';
const SETUP_CARD_VIEW_REGISTRY_ID: string = 'OfficeLocations_SETUP_CARD_VIEW';
const ERROR_CARD_VIEW_REGISTRY_ID: string = 'OfficeLocations_ERROR_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'OfficeLocations_QUICK_VIEW';
export const LIST_VIEW_REGISTRY_ID: string = 'OfficeLocations_LIST_VIEW';

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

      this.state = {
        mainImage: this.properties.mainImage,
        offices: null,
        filteredOffices: null,
        currentOfficeIndex: 0,
        searchText: '',
        cardViewToRender: CARD_VIEW_REGISTRY_ID,
        errorMessage: ''
      };


      this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
      this.cardNavigator.register(SETUP_CARD_VIEW_REGISTRY_ID, () => new SetupCardView());
      this.cardNavigator.register(ERROR_CARD_VIEW_REGISTRY_ID, () => new ErrorCardView());
      this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
      this.quickViewNavigator.register(LIST_VIEW_REGISTRY_ID, () => new ListView());

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

    const {
      dataSource,
      officesTermSetId,
      list,
      useMapsAPI, showMapsInQuickView, mapsSource, bingMapsApiKey, googleMapsApiKey,
      showWeather, getWeatherFromList, weatherList, openWeatherMapApiKey
    } = this.properties;

    if (
      isEmpty(dataSource) ||
      (dataSource === DataSource.Local && isEmpty(this.properties.offices)) ||
      (dataSource === DataSource.Taxonomy && isEmpty(officesTermSetId)) ||
      (dataSource === DataSource.List && isEmpty(list)) ||
      (showMapsInQuickView && isEmpty(mapsSource)) ||
      (showMapsInQuickView && useMapsAPI && mapsSource === MapsSource.Bing && isEmpty(bingMapsApiKey)) ||
      (showMapsInQuickView && useMapsAPI && mapsSource === MapsSource.Google && isEmpty(googleMapsApiKey)) ||
      (showWeather && getWeatherFromList && isEmpty(weatherList)) ||
      (showWeather && !getWeatherFromList && isEmpty(openWeatherMapApiKey))
    ) {
      this.setState({
        cardViewToRender: SETUP_CARD_VIEW_REGISTRY_ID
      });
      this.cardNavigator.replace(this.state.cardViewToRender);
      return;
    }

    setTimeout(async () => {

      let sp: SPFI = null;

      let offices: Office[] = null;

      switch (dataSource) {
        case DataSource.Local:
          offices = this.properties.offices;
          break;
        case DataSource.Taxonomy:
          sp = getSP(this.context);
          let isTermsetValid: boolean = await sp.termStore.validateTermSet(officesTermSetId, "UsedForOfficeLocations", "true");
          if (isTermsetValid) {
            offices = await sp.termStore.getOfficeTerms(officesTermSetId);
          }
          break;
        case DataSource.List:
          if (!isEmpty(list)) {
            sp = getSP(this.context);
            offices = await sp.web.getOfficeItems(list);
          }
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

      offices = sortBy(offices, (office: Office) => office.name);

      offices.forEach(office => {
        office.chatWithManagerLink = !isEmpty(office.managerEmailAddress) ? `https://teams.microsoft.com/l/chat/0/0?users=${office.managerEmailAddress}` : null;
        office.time = null;
        office.gotTime = false;
        office.gotWeather = false;
        office.gotMap = false;
        office.weather = null;
      });

      this.setState({
        offices,
        filteredOffices: offices.map(office => ({ uniqueId: office.uniqueId, address: office.address })),
        cardViewToRender: CARD_VIEW_REGISTRY_ID
      });

      if(this.properties.showSearch) {

        const fuse = await import(
          /* webpackChunkName: 'fuse-js' */
          'fuse.js'
        );

        this.properties.fuse = new fuse.default(offices, {
          keys: ['name', 'address'],
          includeScore: true
        });
      }

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

  protected onRenderTypeChanged(oldRenderType: RenderType): void {
    if (oldRenderType === 'QuickView') {
      // Reset to the Card state when the Quick View was opened.
      this.setState({
        searchText: "",
        currentOfficeIndex: 0,
        filteredOffices: this.state.offices.map(office => ({ uniqueId: office.uniqueId, address: office.address }))
      });
    }
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
      } else {
        this.setState({
          mainImage: require('./assets/OfficeLocation.svg')
        });
      }
    }

    if (
      propertyPath === 'dataSource' ||
      propertyPath === 'officesTermSetId' ||
      propertyPath === 'list' ||
      propertyPath === 'offices' ||
      propertyPath === 'showMapsInQuickView' ||
      propertyPath === 'mapsSource' ||
      propertyPath === 'useMapsAPI' ||
      propertyPath === 'bingMapsApiKey' ||
      propertyPath === 'googleMapsApiKey' ||
      propertyPath === 'showWeather' ||
      propertyPath === 'getWeatherFromList' ||
      propertyPath === 'weatherList' ||
      propertyPath === 'openWeatherMapApiKey'
    ) {
      this.loadOffices();
    }

  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration(this.properties, this.context, this.onPropertyPaneFieldChanged.bind(this));
  }
}
