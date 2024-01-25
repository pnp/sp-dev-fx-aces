import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  PrimaryTextCardView
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'GenericPrimaryTextButtonAdaptiveCardExtensionStrings';
import {
  IGenericPrimaryTextButtonAdaptiveCardExtensionProps,
  IGenericPrimaryTextButtonAdaptiveCardExtensionState
} from '../GenericPrimaryTextButtonAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  IGenericPrimaryTextButtonAdaptiveCardExtensionProps,
  IGenericPrimaryTextButtonAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    return PrimaryTextCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title,
        icon: {
          url: require('../assets/Poll-Icon.png'),
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
