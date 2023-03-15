export type Page = {
    webUrl: string;
    title: string;
    thumbnailWebUrl: string;
    reactions: Reactions;
    webTitle?:string;
};

export type Reactions = {
    likeCount: number;
    commentCount: number;
};

export type GraphPages = {
    "@odata.context"?: string;
    value:Page[];
}

export type Site = {
    id: string;
    title: string;
    url: string;
    webId: string;
}

