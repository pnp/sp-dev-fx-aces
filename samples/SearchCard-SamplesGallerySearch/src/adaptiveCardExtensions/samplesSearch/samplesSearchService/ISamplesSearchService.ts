import { ISampleItem } from "./ISearchResults";

export interface ISamplesSearchService {
    init: (searchServiceUri: string) => void;
    search: (queryString: string) => Promise<ISampleItem[]>;
    getSuggested: (queryString: string) => Promise<ISampleItem | undefined>;
}