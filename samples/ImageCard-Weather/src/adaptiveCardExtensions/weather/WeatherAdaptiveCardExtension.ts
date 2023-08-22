import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension, CardSize } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { WeatherPropertyPane } from './WeatherPropertyPane';
import { SetupCardView } from './cardView/SetupCardView';
import { ErrorCardView } from './cardView/ErrorCardView';
import { WeatherService } from '../../services/WeatherService';
import { IWeatherAdaptiveCardExtensionState } from './IWeatherAdaptiveCardExtensionState';

export interface IWeatherAdaptiveCardExtensionProps {
  title: string;
  imageUrl: string;
  bingMapsKey: string;
  azureMapsKey: string;
  searchValue: string;
  selectedLocation: string;
}

const CARD_VIEW_REGISTRY_ID: string = 'Weather_CARD_VIEW';
const SETUP_CARD_VIEW_REGISTRY_ID: string = 'Weather_SETUP_CARD_VIEW';
const ERROR_CARD_VIEW_REGISTRY_ID: string = 'Weather_ERROR_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Weather_QUICK_VIEW';

export default class WeatherAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IWeatherAdaptiveCardExtensionProps,
  IWeatherAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: WeatherPropertyPane | undefined;
  private weatherService: WeatherService;

  public async onInit(): Promise<void> {
    this.state = {
      loading: true,
      temperature: undefined,
      wind: undefined,
      visibility: undefined,
      pressure: undefined,
      cloudCover: 0,
      iconCode: 0,
      dateTime: '',
      locationName: '',
      phrase: '',
      airQuality: undefined,
      asthmaForecast: undefined,
      fluForecast: undefined,
      dustForecast: undefined,
      cardSize: this.cardSize
    };

    this.weatherService = new WeatherService(this.context);
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.cardNavigator.register(SETUP_CARD_VIEW_REGISTRY_ID, () => new SetupCardView());
    this.cardNavigator.register(ERROR_CARD_VIEW_REGISTRY_ID, () => new ErrorCardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    await this.getWeather();
    return Promise.resolve();
  }

  private async getWeather() {
    if (!this.properties.azureMapsKey || !this.properties.bingMapsKey || !this.properties.selectedLocation) {
      //Commented this out to fix a race condition with the card not being rendered before doing the replace.
      //this.cardNavigator.replace(SETUP_CARD_VIEW_REGISTRY_ID);
    } else {
      setTimeout(async () => {
        try {
          const locationName = this.properties.selectedLocation.split(';')[0];
          const latitude = this.properties.selectedLocation.split(';')[1];
          const longitude = this.properties.selectedLocation.split(';')[2];

          const weatherResult = await this.weatherService.GetWeatherResponse(latitude, longitude, this.properties.azureMapsKey);
          const airQuality = await this.weatherService.GetAirQuality(latitude, longitude, this.properties.azureMapsKey);
          const healthConditions = await this.weatherService.GetDailyIndices(latitude, longitude, 10, this.properties.azureMapsKey);
          console.log(healthConditions);
          if (!weatherResult) {
            this.cardNavigator.replace(ERROR_CARD_VIEW_REGISTRY_ID);
            return;
          }
          this.setState({
            loading: false,
            temperature: weatherResult.temperature,
            wind: weatherResult.wind,
            visibility: weatherResult.visibility,
            pressure: weatherResult.pressure,
            iconCode: weatherResult.iconCode,
            cloudCover: weatherResult.cloudCover,
            dateTime: weatherResult.dateTime,
            locationName: locationName,
            airQuality: airQuality,
            asthmaForecast: healthConditions.filter(x => x.indexId === 23)[0],
            fluForecast: healthConditions.filter(x => x.indexId === 26)[0],
            dustForecast: healthConditions.filter(x => x.indexId === 18)[0],
            phrase: weatherResult.phrase
          });
          this.cardNavigator.replace(CARD_VIEW_REGISTRY_ID);
        } catch (error) {
          console.log(error);
          this.cardNavigator.replace(ERROR_CARD_VIEW_REGISTRY_ID);
        }
      }, 300);
    }
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'Weather-property-pane'*/
      './WeatherPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.WeatherPropertyPane(this.properties, this.context, this.weatherService);
        }
      );
  }

  protected async onPropertyPaneFieldChanged(propertyPath: string, oldValue: string, newValue: string) {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    if ((propertyPath === 'bingMapsKey') || (propertyPath === 'azureMapsKey') || (propertyPath === 'selectedLocation')) {
      await this.getWeather();
    }
    this.context.propertyPane.refresh();
  }

  protected renderCard(): string | undefined {
    let cardRegistryView: string = "";
    if (!this.properties.azureMapsKey || !this.properties.bingMapsKey || !this.properties.selectedLocation) {
      cardRegistryView = SETUP_CARD_VIEW_REGISTRY_ID;
    } else {
      cardRegistryView = CARD_VIEW_REGISTRY_ID;
    }
    return cardRegistryView;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
}
