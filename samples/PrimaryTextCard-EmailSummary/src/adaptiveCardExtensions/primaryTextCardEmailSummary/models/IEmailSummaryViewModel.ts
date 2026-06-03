import { ILatestEmail } from './ILatestEmail';

export interface IEmailSummaryViewModel {
  latestEmail: ILatestEmail | null;
  summary: string | null;
  error: string | null;
}
