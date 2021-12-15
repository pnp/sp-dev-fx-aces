import {
  BasePrimaryTextCardView,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton,
  IPrimaryTextCardParameters
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'UnreadEmailsAdaptiveCardExtensionStrings';
import { IUnreadEmailsAdaptiveCardExtensionProps, IUnreadEmailsAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../UnreadEmailsAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<IUnreadEmailsAdaptiveCardExtensionProps, IUnreadEmailsAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.ButtonTitle,
        action: {
          type: 'ExternalLink',
          parameters: {
            target: strings.ButtonTarget
          }
        }
      }
    ];
  }

  public get data(): IPrimaryTextCardParameters {
    if (this.state.unreadItemCount === -1) return strings.Loading;
    else if (this.state.unreadItemCount === 0) return strings.NoUnread;
    else if (this.state.unreadItemCount > 100) return {...strings.LargeUnread, primaryText: strings.LargeUnread.primaryText.replace('{0}', this.state.unreadItemCount) };
    return {...strings.Unread, primaryText: strings.Unread.primaryText.replace('{0}', this.state.unreadItemCount) };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
        type: 'ExternalLink',
        parameters: {
            target: strings.ButtonTarget
        }
    };
}
}
