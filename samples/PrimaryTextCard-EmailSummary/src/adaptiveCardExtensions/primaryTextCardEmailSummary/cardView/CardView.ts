import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PrimaryTextCardEmailSummaryAdaptiveCardExtensionStrings';
import {
  IPrimaryTextCardEmailSummaryAdaptiveCardExtensionProps,
  IPrimaryTextCardEmailSummaryAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID
} from '../PrimaryTextCardEmailSummaryAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<
  IPrimaryTextCardEmailSummaryAdaptiveCardExtensionProps,
  IPrimaryTextCardEmailSummaryAdaptiveCardExtensionState
> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.QuickViewButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  }

  public get data(): IPrimaryTextCardParameters {
    if (this.state.loading) {
      return {
        primaryText: strings.CardLoadingPrimaryText,
        description: strings.CardLoadingDescription,
        title: this.properties.title
      };
    }

    if (this.state.error) {
      return {
        primaryText: strings.CardErrorPrimaryText,
        description: strings.CardErrorDescription,
        title: this.properties.title
      };
    }

    const subject: string = this.state.latestEmail?.subject?.trim() || strings.DefaultNoSubject;
    const sender: string = this.state.latestEmail?.fromName?.trim()
      || this.state.latestEmail?.fromAddress?.trim()
      || strings.DefaultUnknownSender;

    return {
      primaryText: `${strings.CardLatestEmailPrefix} ${subject}`,
      description: `${strings.CardFromLabel} ${sender}. ${strings.CardSummaryAvailableText}`,
      title: this.properties.title
    };
  }

  public get onCardSelection(): IQuickViewCardAction | undefined {
    return {
      type: 'QuickView',
      parameters: {
        view: QUICK_VIEW_REGISTRY_ID
      }
    };
  }
}
