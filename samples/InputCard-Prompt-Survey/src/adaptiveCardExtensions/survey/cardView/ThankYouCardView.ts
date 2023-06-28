import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  BasicCardView
} from '@microsoft/sp-adaptive-card-extension-base';
import { ISurveyAdaptiveCardExtensionProps, ISurveyAdaptiveCardExtensionState } from '../SurveyAdaptiveCardExtension';

export class ThankYouCardView extends BaseComponentsCardView<ISurveyAdaptiveCardExtensionProps, ISurveyAdaptiveCardExtensionState, ComponentsCardViewParameters> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    return BasicCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title
      },
      header: {
        componentName: 'text',
        text: this.properties.thankYouText || ''
      },
      footer: undefined
    });
  }
}
