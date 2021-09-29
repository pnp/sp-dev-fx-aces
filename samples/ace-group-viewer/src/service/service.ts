import {graph } from "@pnp/graph/presets/all";
import { sp } from "@pnp/sp/presets/all";
import { IMember } from "../models/IMember";

export class PnPService {

    public async _init(): Promise<IMember[]> {
        let members: IMember[] = [];
        await this._loadGroup().then(response => {
            members = response;
        })
        return members;
    }

    public async _getGroupName(): Promise<string> {
        let groupName: string = null;
        const properties = await sp.web.allProperties();
        console.log(properties);
        groupName = properties.GroupAlias;
        return groupName;
    }

    private async _loadGroup(): Promise<IMember[]> {
        let groupId: string = null;
        let members: IMember[] = [];
        await this._getCurrentGroupID().then(id => {
            groupId = id;
            console.log(groupId);
        })
        await this._getGroupMembers(groupId).then(memberArray => {
            members = memberArray;
            console.log(memberArray);
        });
        return members;
    }

    private async _getCurrentGroupID(): Promise<string> {
        const siteProperties = await sp.web.allProperties();
        console.log(siteProperties.GroupId);
        return siteProperties.GroupId;
    }

    private async _getGroupMembers(id: string): Promise<IMember[]> {
        let memberArray: IMember[] = [];
        const members = await graph.groups.getById(id).members();
        members.map(member => {
            memberArray.push(
                {
                    displayName: member.displayName,
                    mail: member.mail
                }
            )
        })
        return memberArray;
    }

}