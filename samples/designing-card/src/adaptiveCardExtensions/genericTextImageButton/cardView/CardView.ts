import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  ImageCardView,
  IExternalLinkCardAction,
  IQuickViewCardAction
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'GenericTextImageButtonAdaptiveCardExtensionStrings';
import {
  IGenericTextImageButtonAdaptiveCardExtensionProps,
  IGenericTextImageButtonAdaptiveCardExtensionState
} from '../GenericTextImageButtonAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  IGenericTextImageButtonAdaptiveCardExtensionProps,
  IGenericTextImageButtonAdaptiveCardExtensionState,
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
        url: require('../assets/Drawings.png'),
        altText: strings.PrimaryText
      },
      footer: {
        componentName: 'cardButton',
        title: strings.Button,
        style: 'positive',
        action: {
          type: 'ExternalLink',
          parameters: {
            isTeamsDeepLink: false,
            target: 'https://pnp.github.io/'
          }
        }
      }
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
