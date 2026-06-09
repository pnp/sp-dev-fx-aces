import { ILatestEmail } from '../models/ILatestEmail';

export interface IEmailRepository {
  getLatestEmail(): Promise<ILatestEmail | undefined>;
}
