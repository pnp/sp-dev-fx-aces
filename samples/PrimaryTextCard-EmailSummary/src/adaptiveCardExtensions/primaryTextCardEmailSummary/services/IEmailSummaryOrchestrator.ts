import { IEmailSummaryViewModel } from '../models/IEmailSummaryViewModel';

export interface IEmailSummaryOrchestrator {
  loadLatestEmailSummary(copilotApiPath: string): Promise<IEmailSummaryViewModel>;
}
