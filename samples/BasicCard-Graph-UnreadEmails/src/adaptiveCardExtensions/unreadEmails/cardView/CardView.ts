import {
  BaseBasicCardView,
  IBasicCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton,
  IPrimaryTextCardParameters
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'UnreadEmailsAdaptiveCardExtensionStrings';
import { IUnreadEmailsAdaptiveCardExtensionProps, IUnreadEmailsAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../UnreadEmailsAdaptiveCardExtension';

export class CardView extends BaseBasicCardView<IUnreadEmailsAdaptiveCardExtensionProps, IUnreadEmailsAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: "Open Outlook",
        action: {
          type: 'ExternalLink',
          parameters: {
            target: "https://outlook.office.com"
          }
        }
      }
    ];
  }

  public get data(): IPrimaryTextCardParameters {
    if (this.state.unreadItemCount === -1) {
      return  {
        primaryText: "Loading ...",
        description: "",
        title: "My Email",
        iconProperty: "MailRepeat"
      };
    }

    return {
      title: this.state.unreadItemCount === 0 ? "My Email" : "Unread Email",
      primaryText: this.state.unreadItemCount > 0 ? `You have ${this.state.unreadItemCount} unread emails in your inbox` : "You have no unread emails 🥳",
      iconProperty: this.state.unreadItemCount > 0 ? 'Mail' : 'Read',
      description: ""
    };
  }
}
