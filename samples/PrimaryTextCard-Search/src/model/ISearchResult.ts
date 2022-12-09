export interface ISearchEntity {
    title: string;
    url: string;
    siteTitle: string;
}

export interface ISearchResult {
    fields: ISearchEntity;
    lastModifiedDateTime: string;
}