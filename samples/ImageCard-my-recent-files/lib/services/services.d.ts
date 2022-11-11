import { DriveItem } from '@microsoft/microsoft-graph-types';
import { BaseComponentContext } from '@microsoft/sp-component-base';
import { IFiles } from '../models/IFiles';
export declare class Services {
    private _context;
    private _msGraphClient;
    constructor(context: BaseComponentContext);
    init: () => Promise<void>;
    getSiteInfo: (siteId: string) => Promise<any>;
    getDriveInfo: (driveId: string) => Promise<any>;
    getRecentFiles: () => Promise<DriveItem[]>;
    getFiles: () => Promise<IFiles[]>;
}
//# sourceMappingURL=services.d.ts.map