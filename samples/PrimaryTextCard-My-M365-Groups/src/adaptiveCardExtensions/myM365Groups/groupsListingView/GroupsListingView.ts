import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'MyM365GroupsAdaptiveCardExtensionStrings';
import { IMyM365GroupsAdaptiveCardExtensionProps, IMyM365GroupsAdaptiveCardExtensionState } from '../MyM365GroupsAdaptiveCardExtension';
import M365GroupService from '../../../services/M365GroupService';
import { IGroup } from "../../../models/IGroup";

export interface IGroupsListingViewData {
  groups: any[];
  selectedGroupType: string;
}

export class GroupsListingView extends BaseAdaptiveCardView<
  IMyM365GroupsAdaptiveCardExtensionProps,
  IMyM365GroupsAdaptiveCardExtensionState,
  IGroupsListingViewData
> {
  private _originalItems: IGroup[] = [];

  public get data(): IGroupsListingViewData {
    const { groups, selectedGroupType } = this.state;

    if (this._originalItems.length === 0) {
      this._originalItems = groups;
    }

    return {
      groups: groups,
      selectedGroupType: selectedGroupType === "ownerGroups" ? "Owner Groups" : "Member Groups"
    };
  }

  public onAction(action: IActionArguments): void {
    if (action.type === 'Submit') {
      const { id, groupId, filterByName } = action.data;

      if (id === 'spo') {
        M365GroupService.getSPOSiteURL(groupId)
          .then((groupUrl: any) => {
            if (groupUrl !== null) {
              window.open(groupUrl.value, '_blank');
            }
          });
      }
      else if (id === 'groupFilter') {
        this.setState({
          groups: filterByName ? this._originalItems.filter(item => item.displayName.toLowerCase().indexOf(filterByName.toLowerCase()) >= 0) : this._originalItems
        });
      }
    }
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/GroupsListingViewTemplate.json');
  }
}