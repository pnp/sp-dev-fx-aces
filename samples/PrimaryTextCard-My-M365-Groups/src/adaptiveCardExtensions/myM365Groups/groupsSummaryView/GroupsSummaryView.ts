import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'MyM365GroupsAdaptiveCardExtensionStrings';
import { IMyM365GroupsAdaptiveCardExtensionProps, IMyM365GroupsAdaptiveCardExtensionState, GROUPS_LISTING_VIEW_REGISTRY_ID, GROUPS_LOADING_VIEW_REGISTRY_ID } from '../MyM365GroupsAdaptiveCardExtension';
import M365GroupService from '../../../services/M365GroupService';

export interface IGroupsSummaryViewData {
  groupTypes: any[];
}

export class GroupsSummaryView extends BaseAdaptiveCardView<
  IMyM365GroupsAdaptiveCardExtensionProps,
  IMyM365GroupsAdaptiveCardExtensionState,
  IGroupsSummaryViewData
> {
  public get data(): IGroupsSummaryViewData {
    const { ownerGroupsCount, memberGroupsCount } = this.state;

    let groupTypes: any[] = [
      {
        id: "ownerGroups",
        title: strings.GroupOwnerText,
        Count: ownerGroupsCount
      },
      {
        id: "memberGroups",
        title: strings.GroupMemberText,
        Count: memberGroupsCount
      }
    ];

    return {
      groupTypes
    };
  }

  public onAction(action: IActionArguments): void {
    this.quickViewNavigator.push(GROUPS_LOADING_VIEW_REGISTRY_ID);

    setTimeout(async () => {
      if (action?.id === "ownerGroups") {
        await M365GroupService.getMyOwnerGroups().then(groups => {
          this.setState({
            groups: groups,
            selectedGroupType: action?.id
          });
        });
      }
      else {
        await M365GroupService.getMyMemberGroups().then(groups => {
          this.setState({
            groups: groups,
            selectedGroupType: action?.id
          });
        });
      }

      this.quickViewNavigator.replace(GROUPS_LISTING_VIEW_REGISTRY_ID);
    }, 0);
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/GroupsSummaryViewTemplate.json');
  }
}