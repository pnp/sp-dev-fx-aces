import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'MyM365GroupsAdaptiveCardExtensionStrings';
import { IMyM365GroupsAdaptiveCardExtensionProps, IMyM365GroupsAdaptiveCardExtensionState, GROUPS_LISTING_VIEW_REGISTRY_ID } from '../MyM365GroupsAdaptiveCardExtension';

export interface IGroupsSummaryViewData {
  groupTypes: any[];
}

export class GroupsSummaryView extends BaseAdaptiveCardView<
  IMyM365GroupsAdaptiveCardExtensionProps,
  IMyM365GroupsAdaptiveCardExtensionState,
  IGroupsSummaryViewData
> {
  public get data(): IGroupsSummaryViewData {
    const { ownerGroups, memberGroups, selectedGroupType } = this.state;

    let groupTypes: any[] = [
      {
        id: "ownerGroups",
        title: "Group Owner",
        Icon: "♛",
        Count: ownerGroups.length
      },
      {
        id: "memberGroups",
        title: "Group Member",
        Icon: "♛",
        Count: memberGroups.length
      }
    ];

    return {
      groupTypes
    };
  }

  public onAction(action: IActionArguments): void {
    this.setState({ selectedGroupType: action?.id });
    this.quickViewNavigator.push(GROUPS_LISTING_VIEW_REGISTRY_ID);
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/GroupsSummaryViewTemplate.json');
  }
}