import { ILatestEmail } from '../models/ILatestEmail';
import { ISummaryResponse } from '../models/ISummaryResponse';

export interface ICopilotSummaryService {
  summarizeEmail(latestEmail: ILatestEmail, copilotApiPath: string): Promise<ISummaryResponse>;
}
