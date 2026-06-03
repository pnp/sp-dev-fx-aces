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
  copilotApiPath?: string;
}

export interface IPrimaryTextCardEmailSummaryAdaptiveCardExtensionState {
  loading: boolean;
  latestEmail: ILatestEmail | null;
  summary: string | null;
  error: string | null;
}

const CARD_VIEW_REGISTRY_ID: string = 'PRIMARY_TEXT_CARD_EMAIL_SUMMARY_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'PRIMARY_TEXT_CARD_EMAIL_SUMMARY_QUICK_VIEW';
const DEFAULT_COPILOT_API_PATH: string = 'https://graph.microsoft.com/beta/copilot/conversations';

export default class PrimaryTextCardEmailSummaryAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IPrimaryTextCardEmailSummaryAdaptiveCardExtensionProps,
  IPrimaryTextCardEmailSummaryAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: PrimaryTextCardEmailSummaryPropertyPane | undefined;
  private _emailSummaryOrchestrator: EmailSummaryOrchestrator | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      loading: true,
      latestEmail: null,
      summary: null,
      error: null
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

    const copilotApiPath: string = this.properties.copilotApiPath ?? DEFAULT_COPILOT_API_PATH;

    try {
      const result = await this._emailSummaryOrchestrator.loadLatestEmailSummary(copilotApiPath);
      this.setState({
        loading: false,
        latestEmail: result.latestEmail,
        summary: result.summary,
        error: result.error
      });
    } catch (error: unknown) {
      const message: string = error instanceof Error ? error.message : 'Unable to load email summary.';
      this.setState({
        loading: false,
        latestEmail: null,
        summary: null,
        error: message
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
