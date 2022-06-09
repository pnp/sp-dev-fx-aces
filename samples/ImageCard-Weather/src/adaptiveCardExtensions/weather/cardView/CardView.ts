import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton,
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'WeatherAdaptiveCardExtensionStrings';
import { IWeatherAdaptiveCardExtensionState } from '../IWeatherAdaptiveCardExtensionState';
import { IWeatherAdaptiveCardExtensionProps, QUICK_VIEW_REGISTRY_ID } from '../WeatherAdaptiveCardExtension';

export class CardView extends BaseImageCardView<IWeatherAdaptiveCardExtensionProps, IWeatherAdaptiveCardExtensionState> {
  /**
   * Buttons will not be visible if card size is 'Medium' with Image Card View.
   * It will support up to two buttons for 'Large' card size.
   */
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.QuickViewButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  }

  public get data(): IImageCardParameters {
    const primaryTextLarge = `${this.state.locationName}  \r${this.state.phrase}  \r${this.state.temperature.value}°${this.state.temperature.unit}`;
    const primaryTextMedium = `${this.state.locationName.split(',')[0]}, ${this.state.temperature.value}°${this.state.temperature.unit}`;
    return {
      primaryText: this.state.cardSize === 'Large' ? primaryTextLarge : primaryTextMedium,
      imageUrl: this.properties.imageUrl,
      title: this.properties.title
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
