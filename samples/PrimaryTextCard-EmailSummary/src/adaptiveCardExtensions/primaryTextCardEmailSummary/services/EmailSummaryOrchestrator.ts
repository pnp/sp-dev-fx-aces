import { IEmailRepository } from '../data/IEmailRepository';
import { ILatestEmail } from '../models/ILatestEmail';
import { ISummaryResponse } from '../models/ISummaryResponse';
import { ICopilotSummaryService } from './ICopilotSummaryService';
import { IEmailSummaryOrchestrator } from './IEmailSummaryOrchestrator';

export class EmailSummaryOrchestrator implements IEmailSummaryOrchestrator {
  public constructor(
    private readonly emailRepository: IEmailRepository,
    private readonly copilotSummaryService: ICopilotSummaryService
  ) {}

  public getLatestEmail(): Promise<ILatestEmail | null> {
    return this.emailRepository.getLatestEmail();
  }

  public summarizeEmail(latestEmail: ILatestEmail): Promise<ISummaryResponse> {
    return this.copilotSummaryService.summarizeEmail(latestEmail);
  }
}
