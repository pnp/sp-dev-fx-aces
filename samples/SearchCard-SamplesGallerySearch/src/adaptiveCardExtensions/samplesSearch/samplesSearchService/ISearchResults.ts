export interface ISearchResults {
    items: ISampleItem[];
}

export interface ISampleItem {
    sampleId: string;
    title: string;
    shortDescription: string;
    url: string;
    products: string[];
    authors: ISampleAuthor[];
    creationDateTime: Date;
    updateDateTime: Date;
}

export interface ISampleAuthor {
    gitHubAccount: string;
    displayName: string;
    company: string;
    pictureUrl: string;
}