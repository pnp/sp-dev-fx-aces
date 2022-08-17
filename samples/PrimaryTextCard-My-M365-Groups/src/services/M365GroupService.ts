import { MSGraphClient } from '@microsoft/sp-http';
import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { IGroup, IGroupCollection, IConnectedService } from "../models/IGroup";

export class M365GroupService {
    public context: AdaptiveCardExtensionContext;

    public setup(context: AdaptiveCardExtensionContext): void {
        this.context = context;
    }

    private async getPaginatedResults(nextLink: string): Promise<Array<IGroup>> {
        return new Promise<any>(async (resolve, reject) => {
          this.context.msGraphClientFactory
            .getClient()
            .then((client: MSGraphClient) => {
              client
                .api(nextLink)
                .get((error: any, results: any, rawResponse: any) => {
                  resolve(this.getGroups(results));
                });
            });
        });
      }
    
      private async getGroups(groups: any): Promise<Array<IGroup>> {
        // Prepare the output array
        var m365groups: Array<IGroup> = new Array<IGroup>();
    
        return new Promise<any>(async (resolve, reject) => {
          // Map the response to the output array
          await Promise.all(groups.value.map(async (item: any) => {
              m365groups.push({
                id: item.id,
                displayName: item.displayName,
                description: item.description,
                visibility: item.visibility,
                connectedServices: await this.getGroupconnectedServices(item.id)
              });
          }));
    
          resolve(m365groups);
        });
      }

    public getMyMemberGroupsCount(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            try {
                this.context.msGraphClientFactory
                    .getClient()
                    .then((client: MSGraphClient) => {
                        client
                            .api(`/me/memberOf/$/microsoft.graph.group?$filter=groupTypes/any(a:a eq 'unified')&$count=true&$select=id`)
                            .headers({ 'ConsistencyLevel': 'eventual' })
                            .get((error: any, members: any, rawResponse: any) => {
                                resolve(members['@odata.count']);
                            });
                    });
            } catch (error) {
                console.error(error);
            }
        });
    }

    public getMyMemberGroups(): Promise<IGroup[]> {
        return new Promise<IGroup[]>((resolve, reject) => {
          try {
            // Prepare the output array
            var m365Groups: Array<IGroup> = new Array<IGroup>();
    
            this.context.msGraphClientFactory
              .getClient()
              .then((client: MSGraphClient) => {
                client
                  .api("/me/memberOf/$/microsoft.graph.group?$filter=groupTypes/any(a:a eq 'unified')&$count=true&$orderby=displayName&$select=id,displayName,description,visibility,groupTypes")
                  .headers({ 'ConsistencyLevel': 'eventual' })
                  .get(async (error: any, groups: IGroupCollection, rawResponse: any) => {
                    m365Groups = await this.getGroups(groups);
    
                    var Uri = groups['@odata.nextLink'];
                    while (Uri) {
                      let pageGroups = await this.getPaginatedResults(groups['@odata.nextLink']);
                      m365Groups = m365Groups.concat(pageGroups);
                      Uri = pageGroups['@odata.nextLink'];
                    }
    
                    resolve(m365Groups);
                  });
              });
          } catch (error) {
            console.error(error);
          }
        });
      }

      public getMyOwnerGroupsCount(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
          try {
            this.context.msGraphClientFactory
              .getClient()
              .then((client: MSGraphClient) => {
                client
                  .api(`/me/ownedObjects/$/microsoft.graph.group?$filter=groupTypes/any(a:a eq 'unified')&$count=true&$select=id`)
                  .headers({ 'ConsistencyLevel': 'eventual' })
                  .get((error: any, members: any, rawResponse: any) => {
                    resolve(members['@odata.count']);
                  });
              });
          } catch (error) {
            console.error(error);
          }
        });
      }
    
      public async getMyOwnerGroups(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
          try {
            // Prepare the output array
            var m365Groups: Array<IGroup> = new Array<IGroup>();
    
            this.context.msGraphClientFactory
              .getClient()
              .then((client: MSGraphClient) => {
                client
                  .api("/me/ownedObjects/$/microsoft.graph.group?$filter=groupTypes/any(a:a eq 'unified')&$orderby=displayName&$count=true&$select=id,displayName,description,visibility,groupTypes")
                  .headers({ 'ConsistencyLevel': 'eventual' })
                  .get(async (error: any, groups: any, rawResponse: any) => {
                    m365Groups = await this.getGroups(groups);
    
                    var Uri = groups['@odata.nextLink'];
                    while (Uri) {
                      let pageGroups = await this.getPaginatedResults(groups['@odata.nextLink']);
                      m365Groups = m365Groups.concat(pageGroups);
                      Uri = pageGroups['@odata.nextLink'];
                    }
    
                    resolve(m365Groups);
                  });
              });
          } catch (error) {
            console.error(error);
          }
        });
      }

    public getSPOSiteURL(groupId: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            try {
                this.context.msGraphClientFactory
                    .getClient()
                    .then((client: MSGraphClient) => {
                        client
                            .api(`/groups/${groupId}/sites/root/weburl`)
                            .get((error: any, group: any, rawResponse: any) => {
                                resolve(group);
                            });
                    });
            } catch (error) {
                console.error(error);
            }
        });
    }

    public getGroupconnectedServices(groupId: string): Promise<IConnectedService[]> {
        return new Promise<IConnectedService[]>((resolve, reject) => {
          try {
            this.context.msGraphClientFactory
              .getClient()
              .then((client: MSGraphClient) => {
                client
                  .api(`/groups/${groupId}/endpoints`)
                  .version('beta')
                  .get((error: any, endpoints: any, rawResponse: any) => {
                    resolve(endpoints.value);
                  });
              });
          } catch (error) {
            console.error(error);
          }
        });
      }
}

const GroupService = new M365GroupService();
export default GroupService;
