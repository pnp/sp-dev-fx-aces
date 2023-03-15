import { GraphPages, Page } from "./types";
import { GraphServiceInstance } from './GraphService';
import { IPropertyFieldSite } from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";

export async function getAllPages(sourceSites: IPropertyFieldSite[]): Promise<Page[]> {
    try {
        const allSitePages: GraphPages[] = [];
        const allPages: GraphPages = {
            value: []
        };
        for (let i = 0; i < sourceSites.length; i++) {
            allSitePages.push(await GraphServiceInstance.GetPages(sourceSites[i]));
        }
        const allPagesValue = allSitePages.map(sitePage => sitePage.value);
        allPagesValue.forEach(pagesValue => {
            pagesValue.forEach(pageValue => {
                allPages.value.push(pageValue);
            })
        })
        const orderedPages = allPages.value.sort(function (p, q) {
            return q.reactions.likeCount - p.reactions.likeCount;
        })
        return orderedPages.slice(0, 10);
    } catch (error) {
        console.error(error);
        return null;
    }
}