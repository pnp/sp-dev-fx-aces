import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'WorkIQTodaySummaryAdaptiveCardExtensionStrings';
import {
  IWorkIQTodaySummaryAdaptiveCardExtensionProps,
  IWorkIQTodaySummaryAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID
} from '../WorkIQTodaySummaryAdaptiveCardExtension';
import { toPlainText, truncate } from '../../../utils/textFormatting';

const CARD_PRIMARY_TEXT_MAX_LENGTH: number = 110;
const CARD_DESCRIPTION_MAX_LENGTH: number = 110;

export class CardView extends BasePrimaryTextCardView<
  IWorkIQTodaySummaryAdaptiveCardExtensionProps,
  IWorkIQTodaySummaryAdaptiveCardExtensionState
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
    return {
      title: this.properties.cardTitle || strings.DefaultCardTitle,
      primaryText: this.getPrimaryText(),
      description: this.getDescription()
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'QuickView',
      parameters: {
        view: QUICK_VIEW_REGISTRY_ID
      }
    };
  }

  private getPrimaryText(): string {
    const { summary } = this.state;
    switch (summary.status) {
      case 'loading':
        return strings.LoadingPrimaryText;
      case 'not-enabled':
        return strings.NotEnabledPrimaryText;
      case 'error':
        return strings.ErrorPrimaryText;
      case 'ready':
        return summary.headline
          ? truncate(toPlainText(summary.headline), CARD_PRIMARY_TEXT_MAX_LENGTH)
          : strings.EmptyPrimaryText;
      default:
        return strings.LoadingPrimaryText;
    }
  }

  private getDescription(): string {
    const { summary } = this.state;
    if ((summary.status === 'error' || summary.status === 'not-enabled') && summary.errorMessage) {
      return truncate(summary.errorMessage, CARD_DESCRIPTION_MAX_LENGTH);
    }
    return strings.CardFootnote;
  }
}
