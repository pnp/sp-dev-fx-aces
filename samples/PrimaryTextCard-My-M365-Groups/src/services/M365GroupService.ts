import { MSGraphClient } from '@microsoft/sp-http';
import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { IGroup, IGroupCollection } from '../models/IGroup';
import { ITeamChannel } from '../models/ITeamChannel';

export class M365GroupService {
    public context: AdaptiveCardExtensionContext;

    public setup(context: AdaptiveCardExtensionContext): void {
        this.context = context;
    }

    public getMyMemberGroups(): Promise<IGroup[]> {
        return new Promise<IGroup[]>((resolve, reject) => {
            try {
                // Prepare the output array
                var m365groups: Array<IGroup> = new Array<IGroup>();

                this.context.msGraphClientFactory
                    .getClient()
                    .then((client: MSGraphClient) => {
                        client
                            .api("/me/memberOf/$/microsoft.graph.group?$filter=groupTypes/any(a:a eq 'unified')")
                            .get((error: any, groups: IGroupCollection, rawResponse: any) => {
                                // Map the response to the output array
                                groups.value.map((item: any) => {
                                    m365groups.push({
                                        id: item.id,
                                        displayName: item.displayName,
                                        description: item.description,
                                        visibility: item.visibility,
                                        teamsConnected: item.resourceProvisioningOptions.indexOf("Team") > -1 ? true : false
                                    });
                                });

                                resolve(m365groups);
                            });
                    });
            } catch (error) {
                console.error(error);
            }
        });
    }

    public getMyOwnerGroups(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            try {
                // Prepare the output array
                var m365groups: Array<IGroup> = new Array<IGroup>();

                this.context.msGraphClientFactory
                    .getClient()
                    .then((client: MSGraphClient) => {
                        client
                            .api("/me/ownedObjects/$/microsoft.graph.group")
                            .get((error: any, groups: any, rawResponse: any) => {
                                // Map the response to the output array
                                groups.value.map((item: any) => {
                                    if (item.groupTypes.indexOf('Unified') > -1) {
                                        m365groups.push({
                                            id: item.id,
                                            displayName: item.displayName,
                                            description: item.description,
                                            visibility: item.visibility,
                                            teamsConnected: item.resourceProvisioningOptions.indexOf("Team") > -1 ? true : false
                                        });
                                    }
                                });

                                resolve(m365groups);
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

    public getMSTeamsGeneralChannelURL = async (teamId): Promise<ITeamChannel[]> => {
        return new Promise<ITeamChannel[]>((resolve, reject) => {
            try {
                this.context.msGraphClientFactory
                    .getClient()
                    .then((client: MSGraphClient) => {
                        client
                            .api(`teams/${teamId}/channels`)
                            .get((error: any, channelsResponse: any, rawResponse: any) => {
                                resolve(channelsResponse.value);
                            });
                    });
            } catch (error) {
                console.log('Error getting channels for team ' + teamId, error);
            }
        });
    }
}

const GroupService = new M365GroupService();
export default GroupService;
