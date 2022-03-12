import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import "@pnp/sp/views";
import ISPListitem from '../models/IListItem';
import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
import { ChoiceFieldFormatType } from "@pnp/sp/fields";
// Class Services
export default class spService {

    
    constructor(private context: AdaptiveCardExtensionContext) {
        sp.setup({
            spfxContext: this.context
        });

       
        // Init
        this.onInit();
    }
    // OnInit Function
    private async onInit() {

    }

   
    public async getListItems(listName: string): Promise<any[]> {
    var today = new Date();
    // use odata operators for more efficient queries

    try{
    const items2: any[] = await sp.web.lists.getByTitle(listName).items
    .filter("(StartDate lt datetime'" + today.toISOString() + "') and (EndDate eq null  or EndDate ge datetime'" + today.toISOString() +  "')")
    .orderBy("Created", true)();
    
    console.log(items2);
    return items2;
    }
    catch(e)
    {
        console.log(e);
        return [];
    }
    }


    
    public async _createListwithColumns(listName: string, colListColumns: any[]) {

        let listExist = await this._checkList(listName);
        console.log("List exist: ", listExist);
        if (!listExist) {
            const listAddResult = await sp.web.lists.add(listName);
            const list = await listAddResult.list.get();

            const newList = await sp.web.lists.getByTitle(listName);
            const view = await newList.defaultView;

            //checking columns are added to the collection or not
            if (colListColumns.length > 0) {
                const batch = sp.web.createBatch();
                colListColumns.forEach(fieldName => {
                    if (fieldName == "QuickViewAdaptiveCardJSON" || fieldName == "QuickViewAdaptiveCardData") {
                        newList.fields.inBatch(batch).addMultilineText(fieldName, 6);
                    }
                    else if(fieldName == "StartDate" || fieldName == "EndDate"){
                        newList.fields.inBatch(batch).addDateTime(fieldName, 6);
                    }
                    else if(fieldName == "OnCardSelectionType"){
                        newList.fields.inBatch(batch).addChoice("OnCardSelectionType", ["Noaction", "ExternalLink", "QuickView"], ChoiceFieldFormatType.Dropdown, false);
                    }
                    else {
                        newList.fields.inBatch(batch).addText(fieldName, 255);
                    }
                });

                colListColumns.forEach(fieldName => {
                    view.fields.inBatch(batch).add(fieldName);

                });

                batch.execute().then(_result => {
                    console.log('List with columns created.');

                }).catch(error => {
                    console.log(error);
                });
                return "List with required columns created.";
            }
        }
        else {
            return "List alreay exist";
        }
    }

    public async _checkList(listName: string) {
        let filterList = `Title eq '${listName}'`;
        let boolResult: boolean = false;
        let getList = await sp.web.lists.filter(filterList).get();
        if (getList.length > 0) {
            return boolResult = true;
        }
        else {
            return boolResult;
        }
    }



}