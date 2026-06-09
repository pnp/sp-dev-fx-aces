import { MSGraphClientFactory, MSGraphClientV3 } from '@microsoft/sp-http';
import { ILatestEmail } from '../models/ILatestEmail';
import { ISummaryResponse } from '../models/ISummaryResponse';
import { withRetry } from '../utils/retry';
import { ICopilotSummaryService } from './ICopilotSummaryService';

// Placeholder until tenant admins confirm the exact Copilot API scope in their environment.
export const COPILOT_GRAPH_SCOPE_PLACEHOLDER: string = 'AiEnterpriseInteraction.Read';

interface ICreateConversationResponse {
  id?: string;
  conversationId?: string;
}

interface IConversationChatRequest {
  message: {
    text: string;
  };
  locationHint: {
    timeZone: string;
  };
  contextualResources: {
    webContext: {
      isWebEnabled: boolean;
    };
  };
}

export class CopilotSummaryService implements ICopilotSummaryService {
  public constructor(private readonly msGraphClientFactory: MSGraphClientFactory) {}

  public async summarizeEmail(latestEmail: ILatestEmail): Promise<ISummaryResponse> {
    const requestBody: IConversationChatRequest = {
      message: {
        text: this.buildPrompt(latestEmail)
      },
      locationHint: {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
      },
      contextualResources: {
        webContext: {
          isWebEnabled: false
        }
      }
    };

    return withRetry<ISummaryResponse>(async () => {
      const graphClient: MSGraphClientV3 = await this.msGraphClientFactory.getClient('3');
      const conversationsUrl: string = 'https://graph.microsoft.com/beta/copilot/conversations';

      let createConversationPayload: unknown;
      try {
        createConversationPayload = await graphClient.api(conversationsUrl).post({});
      } catch (error: unknown) {
        console.error('Copilot conversation creation failed', error);
        throw error;
      }

      const conversationId: string = this.extractConversationId(createConversationPayload);

      let chatPayload: unknown;
      try {
        chatPayload = await graphClient.api(`${conversationsUrl}/${conversationId}/chat`).post(requestBody);
      } catch (error: unknown) {
        console.error('Copilot conversation chat failed', error);
        throw error;
      }

      const summaryText: string = this.extractSummary(chatPayload);

      return {
        summaryText,
        rawResponse: chatPayload
      };
    });
  }

  private buildPrompt(latestEmail: ILatestEmail): string {
    const trimmedBodyText: string = latestEmail.bodyText.trim();
    const bodyForPrompt: string = trimmedBodyText.length > 0 ? trimmedBodyText : latestEmail.bodyPreview;
    return [
      'Summarize the latest email using concise business language.',
      'Return exactly four lines in plain text: three bullet points and one Action item line.',
      `Subject: ${latestEmail.subject}`,
      `From: ${latestEmail.fromName} <${latestEmail.fromAddress}>`,
      `Received: ${latestEmail.receivedDateTime}`,
      `Body: ${bodyForPrompt}`
    ].join('\n');
  }

  private extractSummary(payload: unknown): string {
    const fromMessages: string | undefined = this.extractSummaryFromMessages(payload);
    if (fromMessages) {
      return fromMessages;
    }

    const candidate: string | undefined = this.extractFirstString(payload);

    if (!candidate) {
      throw new Error('Copilot summary response did not contain readable text.');
    }

    return candidate;
  }

  private extractConversationId(payload: unknown): string {
    if (!this.isRecord(payload)) {
      throw new Error('Copilot conversation creation response did not include a conversation id.');
    }

    const candidate: ICreateConversationResponse = payload;
    const conversationId: string | undefined =
      typeof candidate.id === 'string' && candidate.id.length > 0
        ? candidate.id
        : typeof candidate.conversationId === 'string' && candidate.conversationId.length > 0
          ? candidate.conversationId
          : undefined;

    if (!conversationId) {
      throw new Error('Copilot conversation creation response did not include a conversation id.');
    }

    return conversationId;
  }

  private extractSummaryFromMessages(payload: unknown): string | undefined {
    if (!this.isRecord(payload)) {
      return undefined;
    }

    const messagesCandidate: unknown = payload.messages;
    if (!Array.isArray(messagesCandidate) || messagesCandidate.length <= 1) {
      return undefined;
    }

    const messageCandidate: unknown = messagesCandidate[messagesCandidate.length - 1];
    if (!this.isRecord(messageCandidate)) {
      return undefined;
    }

    const contentCandidate: string | undefined = this.extractFirstString(messageCandidate.content);
    if (contentCandidate) {
      return contentCandidate;
    }

    const textCandidate: string | undefined = this.extractFirstString(messageCandidate.text);
    if (textCandidate) {
      return textCandidate;
    }

    return undefined;
  }

  private extractFirstString(value: unknown): string | undefined {
    if (typeof value === 'string') {
      const normalizedValue: string = value.trim();
      return normalizedValue.length > 0 ? normalizedValue : undefined;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        const candidate: string | undefined = this.extractFirstString(item);
        if (candidate) {
          return candidate;
        }
      }
      return undefined;
    }

    if (!this.isRecord(value)) {
      return undefined;
    }

    const preferredOrder: string[] = [
      'summary',
      'output_text',
      'content',
      'text',
      'message',
      'result',
      'data',
      'choices'
    ];

    for (const key of preferredOrder) {
      const candidate: string | undefined = this.extractFirstString(value[key]);
      if (candidate) {
        return candidate;
      }
    }

    for (const key in value) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) {
        continue;
      }

      const candidate: string | undefined = this.extractFirstString(value[key]);
      if (candidate) {
        return candidate;
      }
    }

    return undefined;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
