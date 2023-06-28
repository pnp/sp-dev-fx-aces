import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  TextInputCardView,
  IActionArguments
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SurveyAdaptiveCardExtensionStrings';
import { ISurveyAdaptiveCardExtensionProps, ISurveyAdaptiveCardExtensionState, THANK_YOU_CARD_VIEW_REGISTRY_ID } from '../SurveyAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<ISurveyAdaptiveCardExtensionProps, ISurveyAdaptiveCardExtensionState, ComponentsCardViewParameters> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    return TextInputCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title
      },
      header: {
        componentName: 'text',
        text: this.properties.question || ''
      },
      body: {
        componentName: 'textInput',
        placeholder: strings.Placeholder,
        id: 'answer',
        iconBefore: {
          url: 'Edit'
        }
      },
      footer: {
        componentName: 'cardButton',
        title: strings.Submit,
        style: 'positive',
        action: {
          type: 'Submit',
          parameters: {
            id: 'answer'
          }
        }
      }
    });
  }

  public onAction(action: IActionArguments): void {
    if (action.type === 'Submit' && action.data?.id === 'answer') {
      const answer: string = action.data.answer;
      // TODO: submit answer
      console.log(answer);

      this.cardNavigator.replace(THANK_YOU_CARD_VIEW_REGISTRY_ID);
    }
  }
}
