import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'WeatherAdaptiveCardExtensionStrings';
import { IWeatherAdaptiveCardExtensionState } from '../IWeatherAdaptiveCardExtensionState';
import { IWeatherAdaptiveCardExtensionProps } from '../WeatherAdaptiveCardExtension';

export class ErrorCardView extends BasePrimaryTextCardView<IWeatherAdaptiveCardExtensionProps, IWeatherAdaptiveCardExtensionState> {
  public get data(): IPrimaryTextCardParameters {
    return {
      primaryText: strings.ErrorCardPrimaryTextLabel,
      description: strings.ErrorCardDescriptionLabel
    };
  }
}