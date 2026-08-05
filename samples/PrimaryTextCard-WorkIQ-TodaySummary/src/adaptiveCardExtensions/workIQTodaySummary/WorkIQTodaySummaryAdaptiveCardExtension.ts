import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { AadHttpClient } from '@microsoft/sp-http';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { WorkIQTodaySummaryPropertyPane } from './WorkIQTodaySummaryPropertyPane';
import { WorkIQProxyService } from '../../services/WorkIQProxyService';
import { ISummaryState } from '../../models/IWorkIQTodaySummary';

export interface IWorkIQTodaySummaryAdaptiveCardExtensionProps {
  cardTitle: string;
  proxyFunctionUrl: string;
  proxyResourceId: string;
  refreshIntervalMinutes: string;
  includeTeamsMessages: boolean;
}

export interface IWorkIQTodaySummaryAdaptiveCardExtensionState {
  summary: ISummaryState;
}

const CARD_VIEW_REGISTRY_ID: string = 'WorkIQTodaySummary_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'WorkIQTodaySummary_QUICK_VIEW';

// Default when the property pane field is blank or invalid. Deliberately not
// "every load" — see the README's caching/Copilot-Credits note for why.
const DEFAULT_REFRESH_MINUTES: number = 60;

export default class WorkIQTodaySummaryAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IWorkIQTodaySummaryAdaptiveCardExtensionProps,
  IWorkIQTodaySummaryAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: WorkIQTodaySummaryPropertyPane | undefined;
  private _refreshTimer: number | undefined;

  public onInit(): Promise<void> {
    this.state = { summary: { status: 'loading' } };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    this.scheduleRefresh();
    /* eslint-disable @typescript-eslint/no-floating-promises */
    this.loadSummary();
    /* eslint-enable @typescript-eslint/no-floating-promises */

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'WorkIQTodaySummary-property-pane' */
      './WorkIQTodaySummaryPropertyPane'
    ).then((component) => {
      this._deferredPropertyPane = new component.WorkIQTodaySummaryPropertyPane();
    });
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }

  protected onPropertyPaneFieldChanged(): void {
    this.scheduleRefresh();
    /* eslint-disable @typescript-eslint/no-floating-promises */
    this.loadSummary(true);
    /* eslint-enable @typescript-eslint/no-floating-promises */
  }

  private async loadSummary(forceRefresh: boolean = false): Promise<void> {
    this.setState({ summary: { ...this.state.summary, status: 'loading' } });

    try {
      const client: AadHttpClient = await this.context.aadHttpClientFactory.getClient(this.properties.proxyResourceId);
      const service = new WorkIQProxyService(client);
      const summary = await service.getTodaySummary({
        functionBaseUrl: this.properties.proxyFunctionUrl,
        includeTeamsMessages: this.properties.includeTeamsMessages,
        forceRefresh
      });
      this.setState({ summary });
    } catch (error) {
      this.setState({
        summary: {
          status: 'error',
          errorMessage: (error && error.message) || 'Could not load today’s Work IQ summary.'
        }
      });
    }
  }

  private scheduleRefresh(): void {
    if (this._refreshTimer !== undefined) {
      window.clearInterval(this._refreshTimer);
      this._refreshTimer = undefined;
    }

    const configuredMinutes: number = parseInt(this.properties.refreshIntervalMinutes, 10);
    const intervalMinutes: number = isNaN(configuredMinutes) || configuredMinutes <= 0
      ? DEFAULT_REFRESH_MINUTES
      : configuredMinutes;

    this._refreshTimer = window.setInterval(() => {
      /* eslint-disable @typescript-eslint/no-floating-promises */
      this.loadSummary();
      /* eslint-enable @typescript-eslint/no-floating-promises */
    }, intervalMinutes * 60 * 1000);
  }
}
