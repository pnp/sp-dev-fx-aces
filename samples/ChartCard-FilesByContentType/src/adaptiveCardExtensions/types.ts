export type File = {
    "@odata.etag"?: string;
    contentType: {
        id: string;
        name: string;
    }
};


export type GraphFiles = {
    "@odata.context"?: string;
    value: File[];
};