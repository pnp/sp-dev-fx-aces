import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { ISummaryState, IWorkIQTodaySummaryResponse } from '../models/IWorkIQTodaySummary';

export interface IGetTodaySummaryOptions {
  functionBaseUrl: string;
  includeTeamsMessages: boolean;
  forceRefresh?: boolean;
}

/**
 * Talks to the WorkIQ-TodaySummary-Proxy Azure Function, never to Work IQ directly.
 * See the "Direct vs. proxy" note in the README for why: this keeps the multitenant
 * issuer requirement and the OBO exchange server-side, and gives the Function a place
 * to cache the last response so a dashboard refresh doesn't burn Copilot Credits.
 */
export class WorkIQProxyService {
  constructor(private client: AadHttpClient) {}

  public async getTodaySummary(options: IGetTodaySummaryOptions): Promise<ISummaryState> {
    if (!options.functionBaseUrl) {
      return {
        status: 'error',
        errorMessage: 'This card is missing its proxy function URL. A site admin needs to set it in the card properties.'
      };
    }

    try {
      const url: string = this.buildUrl(options);
      const response: HttpClientResponse = await this.client.get(url, AadHttpClient.configurations.v1);

      if (response.status === 401 || response.status === 403) {
        const body = await this.safeReadJson(response);
        return {
          status: 'not-enabled',
          errorMessage: (body && body.detail) || 'Work IQ isn’t available for your account yet. Ask your admin to confirm Work IQ is enabled and consented in this tenant.'
        };
      }

      if (!response.ok) {
        return {
          status: 'error',
          errorMessage: `The proxy function returned an unexpected error (HTTP ${response.status}).`
        };
      }

      const payload: IWorkIQTodaySummaryResponse = await response.json();
      return {
        status: 'ready',
        headline: payload.headline,
        generatedAt: payload.generatedAt,
        items: payload.items || []
      };
    } catch (error) {
      return {
        status: 'error',
        errorMessage: (error && error.message) || 'Could not reach the WorkIQ-TodaySummary-Proxy function.'
      };
    }
  }

  private buildUrl(options: IGetTodaySummaryOptions): string {
    const base: string = options.functionBaseUrl.replace(/\/$/, '');
    const params: string[] = [`includeTeamsMessages=${options.includeTeamsMessages ? 'true' : 'false'}`];
    if (options.forceRefresh) {
      params.push('forceRefresh=true');
    }
    return `${base}/api/todaySummary?${params.join('&')}`;
  }

  private async safeReadJson(response: HttpClientResponse): Promise<{ detail?: string } | undefined> {
    try {
      return await response.json();
    } catch {
      return undefined;
    }
  }
}
