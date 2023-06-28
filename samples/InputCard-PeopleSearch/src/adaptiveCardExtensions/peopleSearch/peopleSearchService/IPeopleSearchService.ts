import { IPerson } from '../model/IPerson';

export interface IPeopleSearchService {
  search: (queryString: string) => Promise<IPerson[]>;
  getSuggested: () => Promise<IPerson>;
}