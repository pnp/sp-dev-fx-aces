import { ISPFxAdaptiveCard, BaseAdaptiveCardQuickView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PrimaryTextCardEmailSummaryAdaptiveCardExtensionStrings';
import QuickViewTemplate from './template/QuickViewTemplate.json';
import {
  IPrimaryTextCardEmailSummaryAdaptiveCardExtensionProps,
  IPrimaryTextCardEmailSummaryAdaptiveCardExtensionState
} from '../PrimaryTextCardEmailSummaryAdaptiveCardExtension';

export interface IQuickViewData {
  title: string;
  subTitle: string;
  status: 'loading' | 'error' | 'ready';
  showLoading: boolean;
  showError: boolean;
  showReady: boolean;
  loadingTitle: string;
  loadingHelper: string;
  loadingText: string;
  errorText: string;
  emailSubject: string;
  fromLabel: string;
  fromValue: string;
  receivedLabel: string;
  receivedValue: string;
  summaryTitle: string;
  summaryText: string;
  showSummaryLoading: boolean;
  summaryLoadingText: string;
  showSummaryError: boolean;
  summaryErrorText: string;
  showSummaryText: boolean;
  showOpenInOutlookAction: boolean;
  openInOutlookLabel: string;
  openInOutlookUrl: string;
}

export class QuickView extends BaseAdaptiveCardQuickView<
  IPrimaryTextCardEmailSummaryAdaptiveCardExtensionProps,
  IPrimaryTextCardEmailSummaryAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    const isLoading: boolean = this.state.loading;
    const hasError: boolean = Boolean(this.state.error);
    const status: 'loading' | 'error' | 'ready' = isLoading ? 'loading' : hasError ? 'error' : 'ready';
    const showLoading: boolean = status === 'loading';
    const showError: boolean = status === 'error';
    const showReady: boolean = status === 'ready';
    const openInOutlookUrl: string = this.state.latestEmail?.webLink?.trim() || '';

    const fromName: string = this.state.latestEmail?.fromName?.trim() || '';
    const fromAddress: string = this.state.latestEmail?.fromAddress?.trim() || '';
    let fromValue: string;
    if (fromName && fromAddress) {
      fromValue = `${fromName} <${fromAddress}>`;
    } else if (fromName) {
      fromValue = fromName;
    } else if (fromAddress) {
      fromValue = fromAddress;
    } else {
      fromValue = strings.DefaultUnknownSender;
    }

    const showSummaryLoading: boolean = this.state.summaryLoading === true;
    const showSummaryError: boolean = !this.state.summaryLoading && !!this.state.summaryError;
    const showSummaryText: boolean = !this.state.summaryLoading && !this.state.summaryError;

    return {
      title: this.properties.title || strings.Title,
      subTitle: strings.SubTitle,
      status,
      showLoading,
      showError,
      showReady,
      loadingTitle: strings.QuickViewLoadingTitle,
      loadingHelper: strings.QuickViewLoadingHelper,
      loadingText: strings.QuickViewLoadingText,
      errorText: this.state.error || strings.QuickViewErrorText,
      emailSubject: this.state.latestEmail?.subject?.trim() || strings.DefaultNoSubject,
      fromLabel: strings.EmailFromLabel,
      fromValue,
      receivedLabel: strings.EmailReceivedLabel,
      receivedValue: QuickView.formatReceived(this.state.latestEmail?.receivedDateTime),
      summaryTitle: strings.SummarySectionTitle,
      summaryText: this.state.summary?.trim() || strings.DefaultNoSummary,
      showSummaryLoading,
      summaryLoadingText: strings.QuickViewSummaryLoadingText,
      showSummaryError,
      summaryErrorText: this.state.summaryError || strings.QuickViewSummaryErrorText,
      showSummaryText,
      showOpenInOutlookAction: Boolean(openInOutlookUrl),
      openInOutlookLabel: strings.OpenInOutlookLabel,
      openInOutlookUrl
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return QuickViewTemplate as unknown as ISPFxAdaptiveCard;
  }

  private static formatReceived(iso: string | undefined | null): string {
    if (!iso) {
      return strings.DefaultUnknownReceived;
    }
    const parsed: Date = new Date(iso);
    if (isNaN(parsed.getTime())) {
      return strings.DefaultUnknownReceived;
    }
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      };
      return new Intl.DateTimeFormat(undefined, options).format(parsed);
    } catch {
      return strings.DefaultUnknownReceived;
    }
  }
}
