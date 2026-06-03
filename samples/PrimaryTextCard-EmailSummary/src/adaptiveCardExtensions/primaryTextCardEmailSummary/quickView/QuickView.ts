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
  loadingText: string;
  errorText: string;
  emailSubject: string;
  emailFrom: string;
  emailReceived: string;
  emailPreview: string;
  summaryTitle: string;
  summaryText: string;
  showOpenInOutlookAction: boolean;
  openInOutlookLabel: string;
  openInOutlookUrl: string;
}

export class QuickView extends BaseAdaptiveCardQuickView<
  IPrimaryTextCardEmailSummaryAdaptiveCardExtensionProps,
  IPrimaryTextCardEmailSummaryAdaptiveCardExtensionState,
  IQuickViewData
> {
  private _formatReceivedDate(receivedDateTime: string | undefined): string {
    if (!receivedDateTime) {
      return strings.DefaultUnknownReceived;
    }

    const parsedDate: Date = new Date(receivedDateTime);
    return Number.isNaN(parsedDate.getTime()) ? strings.DefaultUnknownReceived : parsedDate.toLocaleString();
  }

  public get data(): IQuickViewData {
    const isLoading: boolean = this.state.loading;
    const hasError: boolean = Boolean(this.state.error);
    const status: 'loading' | 'error' | 'ready' = isLoading ? 'loading' : hasError ? 'error' : 'ready';
    const showLoading: boolean = status === 'loading';
    const showError: boolean = status === 'error';
    const showReady: boolean = status === 'ready';
    const subject: string = this.state.latestEmail?.subject?.trim() || strings.DefaultNoSubject;
    const fromName: string | undefined = this.state.latestEmail?.fromName?.trim();
    const fromAddress: string | undefined = this.state.latestEmail?.fromAddress?.trim();
    const from: string = fromName || fromAddress || strings.DefaultUnknownSender;
    const openInOutlookUrl: string = this.state.latestEmail?.webLink?.trim() || '';

    return {
      title: this.properties.title || strings.Title,
      subTitle: strings.SubTitle,
      status,
      showLoading,
      showError,
      showReady,
      loadingText: strings.QuickViewLoadingText,
      errorText: this.state.error || strings.QuickViewErrorText,
      emailSubject: subject,
      emailFrom: `${strings.EmailFromLabel} ${from}`,
      emailReceived: `${strings.EmailReceivedLabel} ${this._formatReceivedDate(this.state.latestEmail?.receivedDateTime)}`,
      emailPreview: this.state.latestEmail?.bodyPreview?.trim() || strings.DefaultNoPreview,
      summaryTitle: strings.SummarySectionTitle,
      summaryText: this.state.summary?.trim() || strings.DefaultNoSummary,
      showOpenInOutlookAction: Boolean(openInOutlookUrl),
      openInOutlookLabel: strings.OpenInOutlookLabel,
      openInOutlookUrl
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return QuickViewTemplate as unknown as ISPFxAdaptiveCard;
  }
}
