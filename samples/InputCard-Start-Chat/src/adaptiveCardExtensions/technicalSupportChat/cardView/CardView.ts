import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  BasicCardView,
  IActionArguments
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'TechnicalSupportChatAdaptiveCardExtensionStrings';
import { ITechnicalSupportChatAdaptiveCardExtensionProps, ITechnicalSupportChatAdaptiveCardExtensionState } from '../TechnicalSupportChatAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<ITechnicalSupportChatAdaptiveCardExtensionProps, ITechnicalSupportChatAdaptiveCardExtensionState, ComponentsCardViewParameters> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    return BasicCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title
      },
      header: {
        componentName: 'text',
        text: strings.SupportCardContent
      },
      footer: {
        componentName: 'textInput',
        id: 'chatMessage',
        placeholder: strings.Placeholder,
        button: {
          icon: {
            url: 'Send'
          },
          action: {
            type: 'Submit',
            parameters: {
              id: 'chatMessage'
            }
          }
        }
      }
    });
  }
  
  public onAction(action: IActionArguments): void {
    if (action.type === 'Submit' && action.data?.id === 'chatMessage') {
      window.open(`https://teams.microsoft.com/l/chat/0/0?users=${this.properties.supportSpecialistEmail}&message=${action.data.chatMessage}`);
    }
  }
}
