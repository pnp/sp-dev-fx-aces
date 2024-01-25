import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  PrimaryTextCardView,
  IExternalLinkCardAction,
  IQuickViewCardAction
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'GenericPrimaryTextNoButtonAdaptiveCardExtensionStrings';
import {
  IGenericPrimaryTextNoButtonAdaptiveCardExtensionProps,
  IGenericPrimaryTextNoButtonAdaptiveCardExtensionState
} from '../GenericPrimaryTextNoButtonAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  IGenericPrimaryTextNoButtonAdaptiveCardExtensionProps,
  IGenericPrimaryTextNoButtonAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    return PrimaryTextCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title,
        icon: {
          url: require('../assets/Shifts-Icon.png'),
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
