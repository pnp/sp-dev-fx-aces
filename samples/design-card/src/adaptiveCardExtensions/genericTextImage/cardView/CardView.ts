import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  ImageCardView,
  IExternalLinkCardAction,
  IQuickViewCardAction
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'GenericTextImageAdaptiveCardExtensionStrings';
import {
  IGenericTextImageAdaptiveCardExtensionProps,
  IGenericTextImageAdaptiveCardExtensionState
} from '../GenericTextImageAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  IGenericTextImageAdaptiveCardExtensionProps,
  IGenericTextImageAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    return ImageCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title,
        icon: {
          url: require('../assets/Viva-Insights-Icon.png'),
        }
      },
      header: {
        componentName: 'text',
        text: strings.PrimaryText
      },
      image: {
        url: require('../assets/Charts.png'),
        altText: strings.PrimaryText
      },
      footer: undefined
    });
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: 'https://www.bing.com'
      }
    };
  }
}
