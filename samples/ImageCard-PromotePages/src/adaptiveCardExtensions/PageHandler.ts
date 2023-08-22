import { IPropertyFieldSite } from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";
import { IGraphService } from "./GraphService";
import { GraphSitePage } from "./types";

export interface IPageHandler {
    _getAllPages(service: IGraphService, sourceSites: IPropertyFieldSite[]): Promise<GraphSitePage[]>;
    _promotePage(service: IGraphService, page: GraphSitePage): Promise<boolean>;
}

export class PageHandler implements IPageHandler {
    public async _getAllPages(service: IGraphService, sourceSites: IPropertyFieldSite[]): Promise<GraphSitePage[]> {
        try {
            const allSitePages: GraphSitePage[] = [];
            for (let i = 0; i < sourceSites.length; i++) {
                const currentSitePages = await service._getSitePages(sourceSites[i])
                currentSitePages.forEach(
                    p => allSitePages.push(p)
                );
            }
            return allSitePages;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    public async _promotePage(service: IGraphService, page: GraphSitePage): Promise<boolean> {
        try {
            await service._promoteSitePage(page);
            await service._publishSitePage(page);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}