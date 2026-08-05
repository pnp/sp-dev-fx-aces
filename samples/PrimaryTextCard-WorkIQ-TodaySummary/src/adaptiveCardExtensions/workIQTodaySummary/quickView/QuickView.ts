import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { AadHttpClient } from '@microsoft/sp-http';
import * as strings from 'WorkIQTodaySummaryAdaptiveCardExtensionStrings';
import {
  IWorkIQTodaySummaryAdaptiveCardExtensionProps,
  IWorkIQTodaySummaryAdaptiveCardExtensionState
} from '../WorkIQTodaySummaryAdaptiveCardExtension';
import { WorkIQProxyService } from '../../../services/WorkIQProxyService';
import { IWorkIQReferencedItem, WorkIQReferencedItemType } from '../../../models/IWorkIQTodaySummary';
import { toPlainText } from '../../../utils/textFormatting';

interface IQuickViewItem {
  icon: string;
  title: string;
  subtitle: string;
  webUrl: string;
  hasUrl: boolean;
}

export interface IQuickViewData {
  status: string;
  title: string;
  loadingText: string;
  notEnabledTitle: string;
  notEnabledMessage: string;
  errorTitle: string;
  errorMessage: string;
  headline: string;
  generatedAtLabel: string;
  items: IQuickViewItem[];
  hasItems: boolean;
  emptyItemsText: string;
  disclaimer: string;
  retryButtonText: string;
}

const ITEM_ICONS: { [key in WorkIQReferencedItemType]: string } = {
  file: '📄',
  meeting: '📅',
  message: '💬',
  other: '🔗'
};

export class QuickView extends BaseAdaptiveCardView<
  IWorkIQTodaySummaryAdaptiveCardExtensionProps,
  IWorkIQTodaySummaryAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    const { summary } = this.state;
    const items = this.mapItems(summary.items);
    return {
      status: summary.status,
      title: this.properties.cardTitle || strings.QuickViewTitle,
      loadingText: strings.QuickViewLoadingText,
      notEnabledTitle: strings.QuickViewNotEnabledTitle,
      notEnabledMessage: summary.errorMessage || '',
      errorTitle: strings.QuickViewErrorTitle,
      errorMessage: summary.errorMessage || '',
      headline: summary.headline ? toPlainText(summary.headline) : '',
      generatedAtLabel: this.formatGeneratedAt(summary.generatedAt),
      items,
      hasItems: items.length > 0,
      emptyItemsText: strings.QuickViewEmptyItemsText,
      disclaimer: strings.QuickViewDisclaimer,
      retryButtonText: strings.QuickViewRetryButton
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }

  public onAction(action: IActionArguments): void {
    if (action.id !== 'refresh') {
      return;
    }

    this.setState({ summary: { ...this.state.summary, status: 'loading' } });

    this.refresh().catch(() => {
      // refresh() already routes failures into state as an 'error' summary.
    });
  }

  private async refresh(): Promise<void> {
    try {
      const client: AadHttpClient = await this.context.aadHttpClientFactory.getClient(this.properties.proxyResourceId);
      const service = new WorkIQProxyService(client);
      const summary = await service.getTodaySummary({
        functionBaseUrl: this.properties.proxyFunctionUrl,
        includeTeamsMessages: this.properties.includeTeamsMessages,
        forceRefresh: true
      });
      this.setState({ summary });
    } catch (error) {
      this.setState({
        summary: {
          status: 'error',
          errorMessage: (error && error.message) || 'Could not refresh today’s Work IQ summary.'
        }
      });
    }
  }

  private mapItems(items: IWorkIQReferencedItem[] | undefined): IQuickViewItem[] {
    if (!items) {
      return [];
    }
    return items.map((item) => ({
      icon: ITEM_ICONS[item.type] || ITEM_ICONS.other,
      title: item.title,
      subtitle: item.subtitle || '',
      webUrl: item.webUrl || '',
      hasUrl: !!item.webUrl
    }));
  }

  private formatGeneratedAt(generatedAt: string | undefined): string {
    if (!generatedAt) {
      return '';
    }

    const date = new Date(generatedAt);
    if (isNaN(date.getTime())) {
      return '';
    }

    return `${strings.QuickViewGeneratedAtPrefix} ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  }
}
