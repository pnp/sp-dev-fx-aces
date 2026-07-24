import { ISPFXContext } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import { IListItem } from '../models/IListItem';
export declare class SharePointListService {
    private readonly _sp;
    constructor(context: ISPFXContext);
    getListItems(listName: string): Promise<IListItem[]>;
}
//# sourceMappingURL=SharePointListService.d.ts.map