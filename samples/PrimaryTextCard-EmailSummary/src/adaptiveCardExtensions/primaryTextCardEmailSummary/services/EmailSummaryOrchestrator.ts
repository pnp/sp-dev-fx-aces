import { IEmailRepository } from '../data/IEmailRepository';
import { IEmailSummaryViewModel } from '../models/IEmailSummaryViewModel';
import { ICopilotSummaryService } from './ICopilotSummaryService';
import { IEmailSummaryOrchestrator } from './IEmailSummaryOrchestrator';

export class EmailSummaryOrchestrator implements IEmailSummaryOrchestrator {
  public constructor(
    private readonly emailRepository: IEmailRepository,
    private readonly copilotSummaryService: ICopilotSummaryService
  ) {}

  public async loadLatestEmailSummary(copilotApiPath: string): Promise<IEmailSummaryViewModel> {
    const latestEmail = await this.emailRepository.getLatestEmail();

    if (!latestEmail) {
      return {
        latestEmail: null,
        summary: null,
        error: 'No email was found for the current user.'
      };
    }

    const summaryResponse = await this.copilotSummaryService.summarizeEmail(latestEmail, copilotApiPath);

    return {
      latestEmail,
      summary: summaryResponse.summaryText,
      error: null
    };
  }
}
