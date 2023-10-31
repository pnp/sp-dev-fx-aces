import { MSGraphClientV3 } from "@microsoft/sp-http";
import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';

export class NewItemService {

    private MSGraphClient: MSGraphClientV3;
    public context: AdaptiveCardExtensionContext;


    
    public async _getClient(context: AdaptiveCardExtensionContext): Promise<MSGraphClientV3> {
        if (this.MSGraphClient === undefined)
            this.MSGraphClient = await context.msGraphClientFactory.getClient("3");
        return this.MSGraphClient;
    }

    public setup(context: AdaptiveCardExtensionContext): void{
        this.context = context;
    }    

    public async _createItem(listTitle: string, itemTitle: string): Promise<void> {
        const listItem = {
            fields: {
              Title: itemTitle
            }
          };
        await this.MSGraphClient.api("/sites/"+this.context.pageContext.site.id+"/lists/"+listTitle+"/items").post(listItem);
    }

    public async _getListId(listTitle: string): Promise<string> {
        const list = await this.MSGraphClient.api("/sites/"+this.context.pageContext.site.id+"/lists/"+listTitle).get();
        return list.id;
    }
}

const ItemService: NewItemService = new NewItemService();
export default ItemService;