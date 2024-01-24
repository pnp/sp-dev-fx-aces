import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  BasicCardView,
  IExternalLinkCardAction,
  IQuickViewCardAction
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'GenericBasicTextNoButtonAdaptiveCardExtensionStrings';
import {
  IGenericBasicTextNoButtonAdaptiveCardExtensionProps,
  IGenericBasicTextNoButtonAdaptiveCardExtensionState
} from '../GenericBasicTextNoButtonAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  IGenericBasicTextNoButtonAdaptiveCardExtensionProps,
  IGenericBasicTextNoButtonAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    return BasicCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title,
        icon: {
          url: require('../assets/Viva-Topics-Icon.png'),
        }
      },
      header: {
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
