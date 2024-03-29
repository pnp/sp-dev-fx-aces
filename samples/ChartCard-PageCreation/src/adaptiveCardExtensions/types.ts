export type Page = {
    createdDateTime: string;
    promotionKind: string;
};


export type GraphPages = {
    "@odata.context"?: string;
    value:Page[];
}


