import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  PrimaryTextCardView
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'GenericPrimaryTextInputButtonAdaptiveCardExtensionStrings';
import {
  IGenericPrimaryTextInputButtonAdaptiveCardExtensionProps,
  IGenericPrimaryTextInputButtonAdaptiveCardExtensionState
} from '../GenericPrimaryTextInputButtonAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  IGenericPrimaryTextInputButtonAdaptiveCardExtensionProps,
  IGenericPrimaryTextInputButtonAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    return PrimaryTextCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title,
        icon: {
          url: require('../assets/Training-Icon.png'),
        }
      },
      header: {
        componentName: 'text',
        text: strings.SubTitle
      },
      body: {
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
