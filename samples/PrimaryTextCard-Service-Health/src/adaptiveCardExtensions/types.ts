export type Value = {
    id: string;
    title: string;
    service: string;
};

export type ServiceHealthIssues = {
    "@odata.count": number;
    value: Value[];
};

export type Issue = {
    title: string;
    url?: string;
};

export type Service = {
    name: string;
    issues: Issue[],
    numberOfIssues: string;
    serviceIcon?: string;
};