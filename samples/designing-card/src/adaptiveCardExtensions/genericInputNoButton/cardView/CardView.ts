import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  TextInputCardView,
  IExternalLinkCardAction,
  IQuickViewCardAction
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'GenericInputNoButtonAdaptiveCardExtensionStrings';
import {
  IGenericInputNoButtonAdaptiveCardExtensionProps,
  IGenericInputNoButtonAdaptiveCardExtensionState
} from '../GenericInputNoButtonAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  IGenericInputNoButtonAdaptiveCardExtensionProps,
  IGenericInputNoButtonAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    return TextInputCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title,
        icon: {
          url: require('../assets/Placeholder-Icon.png'),
        }
      },
      header: {
        componentName: 'text',
        text: strings.SubTitle
      },
      body: {
        componentName: 'textInput',
        placeholder: strings.TextboxPlaceholder,
        iconBefore: {
          url: 'data:image/png;base64,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',
          altText: ''
        },
        onChange: (newValue: string) => {
          // NOOP
        }
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
