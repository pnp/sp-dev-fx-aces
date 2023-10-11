import {
    BaseComponentsCardView,
    ComponentsCardViewParameters,
    BasicCardView
  } from '@microsoft/sp-adaptive-card-extension-base';
  import { ISetStatusMessageAdaptiveCardExtensionProps, ISetStatusMessageAdaptiveCardExtensionState } from '../SetStatusMessageAdaptiveCardExtension';
  
  export class ValidationCardView extends BaseComponentsCardView<ISetStatusMessageAdaptiveCardExtensionProps, ISetStatusMessageAdaptiveCardExtensionState, ComponentsCardViewParameters> {
    public get cardViewParameters(): ComponentsCardViewParameters {
      return BasicCardView({
        cardBar: {
          componentName: 'cardBar',
          title: this.properties.title
        },
        header: {
          componentName: 'text',
          text: this.properties.validationText || ''
        },
        footer: undefined
      });
    }
  }