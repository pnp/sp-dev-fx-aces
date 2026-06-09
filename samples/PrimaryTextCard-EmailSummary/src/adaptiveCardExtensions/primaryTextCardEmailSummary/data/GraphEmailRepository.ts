import { MSGraphClientFactory, MSGraphClientV3 } from '@microsoft/sp-http';
import { ILatestEmail } from '../models/ILatestEmail';
import { withRetry } from '../utils/retry';
import { IEmailRepository } from './IEmailRepository';

const LATEST_EMAIL_QUERY: string = '/me/mailFolders/Inbox/messages?$select=id,subject,from,receivedDateTime,bodyPreview,body,webLink&$filter=isDraft eq false&$orderby=receivedDateTime desc&$top=1';
const MAX_BODY_TEXT_LENGTH: number = 4000;

interface IGraphMessagesResponse {
  value?: IGraphMessage[];
}

interface IGraphMessage {
  id?: string;
  subject?: string;
  from?: {
    emailAddress?: {
      name?: string;
      address?: string;
    };
  };
  receivedDateTime?: string;
  bodyPreview?: string;
  body?: {
    contentType?: string;
    content?: string;
  };
  webLink?: string;
}

export class GraphEmailRepository implements IEmailRepository {
  public constructor(private readonly msGraphClientFactory: MSGraphClientFactory) {}

  public async getLatestEmail(): Promise<ILatestEmail | null> {
    return withRetry<ILatestEmail | null>(async () => {
      const graphClient: MSGraphClientV3 = await this.msGraphClientFactory.getClient('3');

      let payload: IGraphMessagesResponse;
      try {
        payload = (await graphClient
          .api(LATEST_EMAIL_QUERY)
          .version('v1.0')
          .header('Prefer', 'outlook.body-content-type="text"')
          .header('Prefer', 'IdType="ImmutableId"')
          .header('Prefer', 'outlook.timezone="UTC"')
          .get()) as IGraphMessagesResponse;
      } catch (error: unknown) {
        throw this.createGraphRequestError(error, 'Graph email request failed');
      }

      const latest: IGraphMessage | undefined = payload.value?.[0];

      if (!latest || !latest.id || !latest.receivedDateTime) {
        return null;
      }

      const bodyPreview: string = latest.bodyPreview ?? '';
      const rawBodyContent: string | undefined =
        latest.body?.contentType === 'text' && typeof latest.body.content === 'string'
          ? latest.body.content
          : undefined;
      const trimmedBodyContent: string = rawBodyContent !== undefined ? rawBodyContent.trim() : '';
      const sourceBodyText: string = trimmedBodyContent.length > 0 ? trimmedBodyContent : bodyPreview;
      const bodyText: string =
        sourceBodyText.length > MAX_BODY_TEXT_LENGTH
          ? `${sourceBodyText.substring(0, MAX_BODY_TEXT_LENGTH)}…`
          : sourceBodyText;

      return {
        id: latest.id,
        subject: latest.subject ?? '(No subject)',
        fromName: latest.from?.emailAddress?.name ?? '',
        fromAddress: latest.from?.emailAddress?.address ?? '',
        receivedDateTime: latest.receivedDateTime,
        bodyPreview,
        bodyText,
        webLink: latest.webLink ?? ''
      };
    });
  }

  private createGraphRequestError(error: unknown, messagePrefix: string): Error & { status?: number } {
    const status: number | undefined = this.extractStatusCode(error);
    const graphError: Error & { status?: number } = new Error(
      status !== undefined ? `${messagePrefix} with status ${status}` : messagePrefix
    );

    graphError.status = status;
    return graphError;
  }

  private extractStatusCode(error: unknown): number | undefined {
    if (!this.isRecord(error)) {
      return undefined;
    }

    const statusCandidate: unknown = error.status;
    if (typeof statusCandidate === 'number') {
      return statusCandidate;
    }

    const statusCodeCandidate: unknown = error.statusCode;
    if (typeof statusCodeCandidate === 'number') {
      return statusCodeCandidate;
    }

    const responseStatusCandidate: unknown = error.responseStatusCode;
    if (typeof responseStatusCandidate === 'number') {
      return responseStatusCandidate;
    }

    return undefined;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
