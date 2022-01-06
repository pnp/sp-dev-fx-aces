import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'MyM365GroupsAdaptiveCardExtensionStrings';
import { IMyM365GroupsAdaptiveCardExtensionProps, IMyM365GroupsAdaptiveCardExtensionState } from '../MyM365GroupsAdaptiveCardExtension';
import M365GroupService from '../../../services/M365GroupService';

export interface IGroupsListingViewData {
  groups: any[];
  selectedGroupType: string;
}

export class GroupsListingView extends BaseAdaptiveCardView<
  IMyM365GroupsAdaptiveCardExtensionProps,
  IMyM365GroupsAdaptiveCardExtensionState,
  IGroupsListingViewData
> {
  public get data(): IGroupsListingViewData {
    const { ownerGroups, memberGroups, selectedGroupType } = this.state;

    let groups: any[] = [];

    if (selectedGroupType === "ownerGroups") {
      groups = ownerGroups;
    }
    else if (selectedGroupType === "memberGroups") {
      groups = memberGroups;
    }

    return {
      groups: groups,
      selectedGroupType: ''
    };
  }

  public onAction(action: IActionArguments): void {
    if (action.type === 'Submit') {
      const { id, groupId } = action.data;

      if (id === 'spo') {
        M365GroupService.getSPOSiteURL(groupId)
          .then((groupUrl: any) => {
            if (groupUrl !== null) {
              window.open(groupUrl.value, '_blank');
            }
          });
      }
      else if (id === 'teams') {
        M365GroupService.getMSTeamsGeneralChannelURL(groupId).then(response => {
          window.open(response[0].webUrl, '_blank');
        });
      }
    }
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/GroupsListingViewTemplate.json');
  }
}