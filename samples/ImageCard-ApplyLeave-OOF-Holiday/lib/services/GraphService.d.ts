import { BaseComponentContext } from '@microsoft/sp-component-base';
export interface IGraphHelper {
    Init_GraphClient(): Promise<void>;
}
export declare class GraphService implements IGraphHelper {
    private _context;
    private _msGraphClient;
    constructor(context?: BaseComponentContext);
    Init_GraphClient: () => Promise<any>;
    SetOutOfOffice: (startDate: Date, endDate: Date, offMessage: string) => Promise<any>;
    GetGraphData(apiName: string, version: string): Promise<any>;
}
//# sourceMappingURL=GraphService.d.ts.map