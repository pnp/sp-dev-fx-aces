import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import "@pnp/sp/views";
import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
export default class spService {
    private context;
    constructor(context: AdaptiveCardExtensionContext);
    private onInit;
    getListItems(listName: string): Promise<any[]>;
    _createListwithColumns(listName: string, colListColumns: any[]): Promise<"List with required columns created." | "List alreay exist">;
    _checkList(listName: string): Promise<boolean>;
}
//# sourceMappingURL=spprovider.d.ts.map