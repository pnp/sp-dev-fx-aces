import { ILatestEmail } from '../models/ILatestEmail';
import { ISummaryResponse } from '../models/ISummaryResponse';

export interface IEmailSummaryOrchestrator {
  getLatestEmail(): Promise<ILatestEmail | undefined>;
  summarizeEmail(latestEmail: ILatestEmail): Promise<ISummaryResponse>;
}
