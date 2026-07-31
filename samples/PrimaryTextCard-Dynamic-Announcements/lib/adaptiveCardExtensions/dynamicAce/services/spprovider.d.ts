import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import "@pnp/sp/views";
import "@pnp/sp/batching";
import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
export default class spService {
    private context;
    private _sp;
    constructor(context: AdaptiveCardExtensionContext);
    getListItems(listName: string): Promise<any[]>;
    _createListwithColumns(listName: string, colListColumns: any[]): Promise<string>;
    _checkList(listName: string): Promise<boolean>;
}
//# sourceMappingURL=spprovider.d.ts.map