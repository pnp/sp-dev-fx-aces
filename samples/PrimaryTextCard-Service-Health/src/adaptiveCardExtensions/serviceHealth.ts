import { MSGraph } from "./msgraph";
import { ServiceHealthIssues } from "./types";

export async function getHealthOverview(): Promise<ServiceHealthIssues> {
    try {
        let serviceHealthIssues: ServiceHealthIssues = 
        await MSGraph.Get("/admin/serviceAnnouncement/issues", 
        "v1.0", ["id,title,service"], [], "isResolved eq false", true);
        console.debug("Service health issues response from Microsoft Graph %o", serviceHealthIssues);
        return serviceHealthIssues;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export function getIconForService(servicename: string) {
    switch (servicename) {
        case "Exchange Online":
            return "https://upload.wikimedia.org/wikipedia/commons/e/ea/Microsoft_Exchange_%282019-present%29.svg";
        case "Microsoft 365 suite":
            return "https://static2.sharepointonline.com/files/fabric-cdn-prod_20200430.002/assets/brand-icons/product/svg/office_48x1.svg";
        case "SharePoint Online":
            return "https://static2.sharepointonline.com/files/fabric-cdn-prod_20200430.002/assets/brand-icons/product/svg/sharepoint_48x1.svg";
        
        default:
            return "https://static2.sharepointonline.com/files/fabric-cdn-prod_20200430.002/assets/brand-icons/product/svg/office_48x1.svg";
    }
}