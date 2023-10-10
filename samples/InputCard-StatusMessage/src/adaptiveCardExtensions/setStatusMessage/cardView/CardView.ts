import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  TextInputCardView,
  IActionArguments
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SetStatusMessageAdaptiveCardExtensionStrings';
import {
  ISetStatusMessageAdaptiveCardExtensionProps,
  ISetStatusMessageAdaptiveCardExtensionState,
  VALIDATION_CARD_VIEW_REGISTRY_ID
} from '../SetStatusMessageAdaptiveCardExtension';
import { GraphService, IGraphService } from '../../GraphService';
import { PresenceStatusMessage } from '../../types';

export class CardView extends BaseComponentsCardView<
  ISetStatusMessageAdaptiveCardExtensionProps,
  ISetStatusMessageAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    return TextInputCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title
      },
      header: {
        componentName: 'text',
        text: this.state.currentStatusMessage !== "" ? this.state.currentStatusMessage : "No status message."
      },
      body: {
        componentName: 'textInput',
        placeholder: strings.Placeholder,
        id: 'status',
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
            id: 'status'
          }
        }
      }
    });
  }

  public async onAction(action: IActionArguments): Promise<void> {
    if (action.type === 'Submit' && action.data?.id === 'status') {
      const status: string = action.data.status;
      const statusMessage: PresenceStatusMessage = {
        "statusMessage": {
          "message": {
            "content": status,
            "contentType": "text"
          },
          "expiryDateTime": {
            "dateTime": "9999-12-30T23:00:00.0000000Z",
            "timeZone": "Pacific Standard Time"
          }
        }
      };
      const service: IGraphService = new GraphService(this.context)
      await service._updateStatusMessage(statusMessage)

      console.log(status);

      this.cardNavigator.replace(VALIDATION_CARD_VIEW_REGISTRY_ID);
    }
  }
}
