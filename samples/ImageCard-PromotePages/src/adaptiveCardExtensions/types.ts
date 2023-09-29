export type GraphSitePageCollection = {
    value: GraphSitePage[];
}

export type GraphSitePage = {
    id: string;
    title: string;
    webUrl: string;
    thumbnailWebUrl: string;
    description: string;
    parentSiteId: string;
    parentSiteTitle: string;
    lastModifiedDateTime: string;
}