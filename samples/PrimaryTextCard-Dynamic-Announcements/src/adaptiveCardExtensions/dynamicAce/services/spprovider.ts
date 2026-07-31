import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import "@pnp/sp/views";
import "@pnp/sp/batching";
import { ChoiceFieldFormatType, DateTimeFieldFormatType } from "@pnp/sp/fields";
import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";

// Class Services
export default class spService {

    private _sp: SPFI;

    constructor(private context: AdaptiveCardExtensionContext) {
        this._sp = spfi().using(SPFx(this.context));
    }

    // Returns active announcement items (StartDate reached, EndDate not passed)
    public async getListItems(listName: string): Promise<any[]> {
        const today = new Date();
        try {
            const items2: any[] = await this._sp.web.lists.getByTitle(listName).items
                .filter("(StartDate lt datetime'" + today.toISOString() + "') and (EndDate eq null  or EndDate ge datetime'" + today.toISOString() + "')")
                .orderBy("Created", true)();
            return items2;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    public async _createListwithColumns(listName: string, colListColumns: any[]): Promise<string> {
        const listExist = await this._checkList(listName);
        if (listExist) {
            return "List alreay exist";
        }

        await this._sp.web.lists.add(listName);

        if (colListColumns.length > 0) {
            // Create the fields in a batch
            const [batchedSP, executeFields] = this._sp.batched();
            const batchedFields = batchedSP.web.lists.getByTitle(listName).fields;

            colListColumns.forEach(fieldName => {
                if (fieldName === "QuickViewAdaptiveCardJSON" || fieldName === "QuickViewAdaptiveCardData") {
                    batchedFields.addMultilineText(fieldName, { NumberOfLines: 6, RichText: false, RestrictedMode: false, AppendOnly: false }).catch(e => console.log(e));
                } else if (fieldName === "StartDate" || fieldName === "EndDate") {
                    batchedFields.addDateTime(fieldName, { DisplayFormat: DateTimeFieldFormatType.DateTime }).catch(e => console.log(e));
                } else if (fieldName === "OnCardSelectionType") {
                    batchedFields.addChoice("OnCardSelectionType", { Choices: ["Noaction", "ExternalLink", "QuickView"], EditFormat: ChoiceFieldFormatType.Dropdown, FillInChoice: false }).catch(e => console.log(e));
                } else {
                    batchedFields.addText(fieldName, { MaxLength: 255 }).catch(e => console.log(e));
                }
            });

            await executeFields();

            // Add the created fields to the default view in a second batch
            const [batchedViewSP, executeView] = this._sp.batched();
            const batchedViewFields = batchedViewSP.web.lists.getByTitle(listName).defaultView.fields;

            colListColumns.forEach(fieldName => {
                batchedViewFields.add(fieldName).catch(e => console.log(e));
            });

            await executeView();
        }

        return "List with required columns created.";
    }

    public async _checkList(listName: string): Promise<boolean> {
        const filterList = `Title eq '${listName}'`;
        const getList = await this._sp.web.lists.filter(filterList)();
        return getList.length > 0;
    }
}