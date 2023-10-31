import {
    BaseComponentsCardView,
    ComponentsCardViewParameters,
    BasicCardView
  } from '@microsoft/sp-adaptive-card-extension-base';
  import {
    IGenericNewItemAdaptiveCardExtensionProps,
    IGenericNewItemAdaptiveCardExtensionState
  } from '../GenericNewItemAdaptiveCardExtension';
  
  export class SuccessCardView extends BaseComponentsCardView<IGenericNewItemAdaptiveCardExtensionProps, IGenericNewItemAdaptiveCardExtensionState, ComponentsCardViewParameters> {
    public get cardViewParameters(): ComponentsCardViewParameters {
      return BasicCardView({
        cardBar: {
          componentName: 'cardBar',
          title: this.properties.title
        },
        header: {
          componentName: 'text',
          text: this.properties.successTxt
        },
        footer: undefined
      });
    }
  }