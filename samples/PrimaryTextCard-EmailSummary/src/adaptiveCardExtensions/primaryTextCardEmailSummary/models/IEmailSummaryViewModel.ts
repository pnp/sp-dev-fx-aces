import { ILatestEmail } from './ILatestEmail';

export interface IEmailSummaryViewModel {
  latestEmail: ILatestEmail | undefined;
  summary: string | undefined;
  error: string | undefined;
}
