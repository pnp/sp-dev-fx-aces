import {
  BaseImageCardView,
  IImageCardParameters
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PublicHolidaysAdaptiveCardExtensionStrings';
import { IPublicHolidaysAdaptiveCardExtensionProps, IPublicHolidaysAdaptiveCardExtensionState } from '../PublicHolidaysAdaptiveCardExtension';

export class ErrorCardView extends BaseImageCardView<IPublicHolidaysAdaptiveCardExtensionProps, IPublicHolidaysAdaptiveCardExtensionState> {
  public get data(): IImageCardParameters {
    return {
      title: strings.ErrorOccuredText,
      primaryText: strings.SomethingWentWrongText,
      imageUrl: require('../assets/PublicHoliday.jpg')
    };
  }
}