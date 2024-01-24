import {
  BaseComponentsCardView,
  BasicCardView,
  ComponentsCardViewParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'GenericTextInputButtonAdaptiveCardExtensionStrings';
import {
  IGenericTextInputButtonAdaptiveCardExtensionProps,
  IGenericTextInputButtonAdaptiveCardExtensionState
} from '../GenericTextInputButtonAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  IGenericTextInputButtonAdaptiveCardExtensionProps,
  IGenericTextInputButtonAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    return BasicCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title,
        icon: {
          url: require('../assets/Person-Support-Icon.png'),
        }
      },
      header: {
        componentName: 'text',
        text: strings.PrimaryText
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
