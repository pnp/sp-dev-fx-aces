export type LinesOpenExtension = {
    line: string;
    id?: string;
};

export type ExtensionResponse = {
    value: LinesOpenExtension[];
};

export type TfLLineStatus = {
    id: number;
    statusSeverity: number;
    statusSeverityDescription: string;
};

export type TfLLine = {
    id: string;
    name: string;
    lineStatuses: TfLLineStatus[];
};

export type Line = {
    id: string;
    name: string;
    status: string;
    severity: number;
    colour: string;
    icon: string;
    isFavourite?: boolean;
    favouriteIconSvg?: string;
    statusStyle?: string;
    columnStyle?: string;
};
