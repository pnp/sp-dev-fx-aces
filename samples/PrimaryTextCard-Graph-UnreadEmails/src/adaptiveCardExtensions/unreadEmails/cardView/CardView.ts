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
    if (this.state.error) return { ...strings.Error, description: this.state.error.message };
    if (!this.state.results) return strings.Loading;
    const unreadCount: number = this.state.results.unreadItemCount ?? 0;
    if (unreadCount === 0) return strings.NoUnread;
    if (unreadCount > 100) return { ...strings.LargeUnread, primaryText: strings.LargeUnread.primaryText.replace('{0}', unreadCount.toString()) };
    return { ...strings.Unread, primaryText: strings.Unread.primaryText.replace('{0}', unreadCount.toString()) };
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
