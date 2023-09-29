import { MSGraphClientV3 } from "@microsoft/sp-http";
import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { GraphSitePage, GraphSitePageCollection } from "./types";
import { IPropertyFieldSite } from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";
import { format } from 'date-fns';


export interface IGraphService {
    _getSitePages(site: IPropertyFieldSite | undefined): Promise<GraphSitePage[]>;
    _promoteSitePage(page: GraphSitePage): Promise<void>;
    _publishSitePage(page: GraphSitePage): Promise<void>;
}

export class GraphService implements IGraphService {
    public Context: AdaptiveCardExtensionContext;
    private MSGraphClient: MSGraphClientV3;

    constructor(Context: AdaptiveCardExtensionContext) {
        this.Context = Context;
    }

    private async _getClient(): Promise<MSGraphClientV3> {
        if (this.MSGraphClient === undefined)
            this.MSGraphClient = await this.Context.msGraphClientFactory.getClient("3");
        return this.MSGraphClient;
    }

    public async _getSitePages(site: IPropertyFieldSite): Promise<GraphSitePage[]> {
        const pages: GraphSitePage[] = [];
        const client = await this._getClient();
        const retrievedPages: GraphSitePageCollection = await client.api("sites/" + site.id + "/pages/microsoft.graph.sitePage").filter("promotionKind eq 'page' and pageLayout ne 'home'").orderby("lastModifiedDateTime desc").select("id,title,thumbnailWebUrl,description,webUrl,lastModifiedDateTime,promotionKind,pageLayout").top(50).version('beta').get();
        retrievedPages.value.forEach(page => {
            pages.push(
                {
                    id: page.id,
                    title: page.title,
                    webUrl: site.url + "/" + page.webUrl,
                    thumbnailWebUrl: page.thumbnailWebUrl,
                    description: page.description,
                    parentSiteId: site.id,
                    parentSiteTitle: site.title,
                    lastModifiedDateTime: format(new Date(page.lastModifiedDateTime), 'yyyy-MM-dd HH:mm:ss')
                }
            )
        });
        return pages;
    }

    public async _promoteSitePage(page: GraphSitePage): Promise<void> {
        const sitePage = {
            "@odata.type": "#microsoft.graph.sitePage",
            "promotionKind": "newsPost"
        }
        const client = await this._getClient();
        // const isPromoted: any = await client.api("sites/" + page.parentSiteId + "/pages/" + page.id + "/microsoft.graph.sitePage").version('beta').update(sitePage);
        await client.api("sites/" + page.parentSiteId + "/pages/" + page.id + "/microsoft.graph.sitePage").version('beta').update(sitePage);
    }

    public async _publishSitePage(page: GraphSitePage): Promise<void> {
        const client = await this._getClient();
        // const isPublished: any = await client.api("sites/" + page.parentSiteId + "/pages/" + page.id + "/microsoft.graph.sitePage/publish").version('beta').post();
        await client.api("sites/" + page.parentSiteId + "/pages/" + page.id + "/microsoft.graph.sitePage/publish").version('beta').post(page);
    }




}