import { MSGraph } from "./msgraph";
import { ServiceHealthIssues } from "./types";

export async function getHealthOverview(): Promise<ServiceHealthIssues> {
    try {
        
        let serviceHealthIssues: ServiceHealthIssues = 
        await MSGraph.Get("/admin/serviceAnnouncement/issues", 
        "v1.0", ["id,title,service"], [], "isResolved eq false", true);
        console.debug("Service health issues response from Microsoft Graph %o", serviceHealthIssues);
        return serviceHealthIssues;

        // * Mock data
        /* let s: ServiceHealthIssues = {
            "@odata.count": 4,
            "value": [
                {
                    "title": "Admins see some users' Outlook Desktop activity isn't shown in usage reports",
                    "id": "MO262870",
                    "service": "Microsoft 365 suite"
                },
                {
                    "title": "Admins’ custom connectors on Data Loss Prevention (DLP) policies are removed when edited in Power Platform admin center",
                    "id": "MO275990",
                    "service": "Microsoft 365 suite"
                },
                {
                    "title": "Users are unable to toggle desktop notifications in Outlook on the web",
                    "id": "EX294175",
                    "service": "Exchange Online"
                },
                {
                    "title": "Some admins may be unable to access the SharePoint admin center from the left pane in the classic experience",
                    "id": "SP291527",
                    "service": "SharePoint Online"
                }
            ]
        }

        return s; */

    } catch (error) {
        console.error(error);
        return null;
    }
}

//TODO: Add icons for each service
//or create svg in 'assets' folder 
//and use them using require('./assets/icon_name.svg')

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