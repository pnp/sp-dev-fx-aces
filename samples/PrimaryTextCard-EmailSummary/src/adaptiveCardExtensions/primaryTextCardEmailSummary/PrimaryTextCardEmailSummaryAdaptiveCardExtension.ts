import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { PrimaryTextCardEmailSummaryPropertyPane } from './PrimaryTextCardEmailSummaryPropertyPane';
import { ILatestEmail } from './models/ILatestEmail';
import { GraphEmailRepository } from './data/GraphEmailRepository';
import { CopilotSummaryService } from './services/CopilotSummaryService';
import { EmailSummaryOrchestrator } from './services/EmailSummaryOrchestrator';

export interface IPrimaryTextCardEmailSummaryAdaptiveCardExtensionProps {
  title: string;
}

export interface IPrimaryTextCardEmailSummaryAdaptiveCardExtensionState {
  loading: boolean;
  summaryLoading: boolean;
  latestEmail: ILatestEmail | undefined;
  summary: string | undefined;
  error: string | undefined;
  summaryError: string | undefined;
}

const CARD_VIEW_REGISTRY_ID: string = 'PRIMARY_TEXT_CARD_EMAIL_SUMMARY_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'PRIMARY_TEXT_CARD_EMAIL_SUMMARY_QUICK_VIEW';

export default class PrimaryTextCardEmailSummaryAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IPrimaryTextCardEmailSummaryAdaptiveCardExtensionProps,
  IPrimaryTextCardEmailSummaryAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: PrimaryTextCardEmailSummaryPropertyPane | undefined;
  private _emailSummaryOrchestrator: EmailSummaryOrchestrator | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      loading: true,
      summaryLoading: false,
      latestEmail: undefined,
      summary: undefined,
      error: undefined,
      summaryError: undefined
    };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    // registers the quick view to open via QuickView action
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    const emailRepository: GraphEmailRepository = new GraphEmailRepository(this.context.msGraphClientFactory);
    const copilotSummaryService: CopilotSummaryService = new CopilotSummaryService(this.context.msGraphClientFactory);
    this._emailSummaryOrchestrator = new EmailSummaryOrchestrator(emailRepository, copilotSummaryService);

    await this._loadEmailSummary();
  }

  private async _loadEmailSummary(): Promise<void> {
    if (!this._emailSummaryOrchestrator) {
      this.setState({
        loading: false,
        error: 'Email summary services are not initialized.'
      });
      return;
    }

    let latestEmail: ILatestEmail | undefined;
    try {
      latestEmail = await this._emailSummaryOrchestrator.getLatestEmail();
    } catch (error: unknown) {
      const message: string = error instanceof Error ? error.message : 'Unable to load the latest email.';
      this.setState({
        loading: false,
        latestEmail: undefined,
        summary: undefined,
        error: message,
        summaryLoading: false,
        summaryError: undefined
      });
      return;
    }

    if (!latestEmail) {
      this.setState({
        loading: false,
        latestEmail: undefined,
        summary: undefined,
        error: 'No email was found for the current user.',
        summaryLoading: false,
        summaryError: undefined
      });
      return;
    }

    this.setState({
      loading: false,
      latestEmail,
      error: undefined,
      summaryLoading: true,
      summary: undefined,
      summaryError: undefined
    });

    try {
      const response = await this._emailSummaryOrchestrator.summarizeEmail(latestEmail);
      this.setState({
        summaryLoading: false,
        summary: response.summaryText,
        summaryError: undefined
      });
    } catch (error: unknown) {
      const message: string = error instanceof Error ? error.message : 'Unable to generate the Copilot summary.';
      this.setState({
        summaryLoading: false,
        summary: undefined,
        summaryError: message
      });
    }
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'primary-text-card-email-summary-property-pane'*/
      './PrimaryTextCardEmailSummaryPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.PrimaryTextCardEmailSummaryPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration() ?? super.getPropertyPaneConfiguration();
  }
}
