import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'WeatherAdaptiveCardExtensionStrings';
import { IWeatherAdaptiveCardExtensionState } from '../IWeatherAdaptiveCardExtensionState';
import { IWeatherAdaptiveCardExtensionProps } from '../WeatherAdaptiveCardExtension';

export interface IQuickViewData {
  subTitle: string;
  title: string;
  imageUrl: string;
  temperature: number;
  temperatureUnit: string;
  windSpeed: number;
  windSpeedUnit: string;
  visibility: number;
  visibilityUnit: string;
  pressure: number;
  pressureUnit: string;
  cloudCover: number;
  airQualityCategory: string;
  asthmaForecast: string;
  fluForecast: string;
  dustForecast: string;
  dt: string;
}

export class QuickView extends BaseAdaptiveCardView<
  IWeatherAdaptiveCardExtensionProps,
  IWeatherAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      subTitle: strings.SubTitle,
      title: this.state.locationName,
      imageUrl: require(`../assets/${this.state.iconCode}.png`),
      temperature: this.state.temperature.value,
      temperatureUnit: this.state.temperature.unit,
      windSpeed: this.state.wind.speed.value,
      windSpeedUnit: this.state.wind.speed.unit,
      visibility: this.state.visibility.value,
      visibilityUnit: this.state.visibility.unit,
      pressure: this.state.pressure.value,
      pressureUnit: this.state.pressure.unit,
      cloudCover: this.state.cloudCover,
      airQualityCategory: this.state.airQuality.category,
      asthmaForecast: this.state.asthmaForecast.category,
      fluForecast: this.state.fluForecast.category,
      dustForecast: this.state.dustForecast.category,
      dt: this.state.dateTime
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}