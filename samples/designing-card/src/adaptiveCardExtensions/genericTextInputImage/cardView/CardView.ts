import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  ImageCardView,
  IExternalLinkCardAction,
  IQuickViewCardAction
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'GenericTextInputImageAdaptiveCardExtensionStrings';
import {
  IGenericTextInputImageAdaptiveCardExtensionProps,
  IGenericTextInputImageAdaptiveCardExtensionState
} from '../GenericTextInputImageAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  IGenericTextInputImageAdaptiveCardExtensionProps,
  IGenericTextInputImageAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    return ImageCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title,
        icon: {
          url: require('../assets/Form-Icon.png'),
        }
      },
      header: {
        componentName: 'text',
        text: strings.PrimaryText
      },
      image: {
        url: require('../assets/Drone.png'),
        altText: ''
      },
      footer: {
        componentName: 'textInput',
        placeholder: strings.TextboxPlaceholder,
        button: {
          icon: {
            url: require('../assets/Send-Shape-White.png'),
            altText: ''  
          },
          action: {
            type: 'ExternalLink',
            parameters: {
              isTeamsDeepLink: false,
              target: 'https://pnp.github.io/'
            }
          }
        },
        onChange: (newValue: string) => {
          // NOOP
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
