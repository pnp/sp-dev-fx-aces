import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
import { IUsers } from "../Model/IUsers";
import { MSGraphClientV3 } from '@microsoft/sp-http';
import { IGraphAPIService } from "./IGraphAPIService";

export class GraphAPIService implements IGraphAPIService {
    public context: AdaptiveCardExtensionContext;
    public msgraphClient: MSGraphClientV3;

    constructor(context: AdaptiveCardExtensionContext) {
        this.context = context;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public getPaginatedResults = async (nextLink: string): Promise<any> => {
        try {
            this.msgraphClient = await this.context.msGraphClientFactory.getClient("3");
            return await this.msgraphClient.api(nextLink).get();
        } catch (error) {
            console.error(error);
        }
    }

    public fetchUsers = async (filterText?: string): Promise<Array<IUsers>> => {
        let usersArray: Array<IUsers> = [];
        try {
            const url: string = !!filterText ? `/users?$filter=startswith(displayName,'${filterText}')`+
                ` or startswith(givenName,'${filterText}') or startswith(surname,'${filterText}') or startswith(mail,'${filterText}')` +
                `or startswith(userPrincipalName,'${filterText}')` : `/me/people?$filter=personType/subclass eq 'OrganizationUser'`;

            this.msgraphClient = await this.context.msGraphClientFactory.getClient("3");

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const apiresult: any = await this.msgraphClient.api(url).get();
            console.log(apiresult);
            usersArray = apiresult.value;
            let Uri: string = apiresult['@odata.nextLink'];
            if (filterText) {
                while (Uri) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const apiresultPaginated: any = await this.getPaginatedResults(Uri);
                    console.log(apiresultPaginated);
                    usersArray = usersArray.concat(apiresultPaginated.value);
                    Uri = apiresultPaginated['@odata.nextLink'];
                }
            }
        } catch (error) {
            console.error(error);
        }
        return usersArray;
    }
}