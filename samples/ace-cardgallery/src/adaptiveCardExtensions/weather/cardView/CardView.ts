import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction
} from '@microsoft/sp-adaptive-card-extension-base';

import { WeatherCardIcon } from '../../../icons/cg.icons';
import { IWeatherAdaptiveCardExtensionProps, IWeatherAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../WeatherAdaptiveCardExtension';

export class CardView extends BaseImageCardView<IWeatherAdaptiveCardExtensionProps, IWeatherAdaptiveCardExtensionState> {

  public get data(): IImageCardParameters {
    const imageUrl: any = require(`../assets/ace-weather-image.png`);
    return {
      primaryText: this.properties.description,
      imageUrl: imageUrl,
      iconProperty: WeatherCardIcon
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'QuickView',
      parameters: {
        view: QUICK_VIEW_REGISTRY_ID
      }
    };
  }
}
