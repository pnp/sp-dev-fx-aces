import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  BasicCardView,
  IExternalLinkCardAction,
  IQuickViewCardAction
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'GenericBasicTextButtonAdaptiveCardExtensionStrings';
import {
  IGenericBasicTextButtonAdaptiveCardExtensionProps,
  IGenericBasicTextButtonAdaptiveCardExtensionState
} from '../GenericBasicTextButtonAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  IGenericBasicTextButtonAdaptiveCardExtensionProps,
  IGenericBasicTextButtonAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    return BasicCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title,
        icon: {
          url: require('../assets/Approvals-Icon.png'),
        }
      },
      header: {
        componentName: 'text',
        text: strings.PrimaryText
      },
      footer: {
        componentName: 'cardButton',
        title: strings.Button,
        style: 'default',
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
