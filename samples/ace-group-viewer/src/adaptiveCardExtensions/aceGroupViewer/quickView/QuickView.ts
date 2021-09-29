import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { IMember } from '../../../models/IMember';
import * as strings from 'AceGroupViewerAdaptiveCardExtensionStrings';
import { IAceGroupViewerAdaptiveCardExtensionProps, IAceGroupViewerAdaptiveCardExtensionState } from '../AceGroupViewerAdaptiveCardExtension';

export interface IQuickViewData {
  subTitle: string;
  title: string;
  description: string;
  memberCount: number;
  groupName: string;
  members: IMember[];
}

export class QuickView extends BaseAdaptiveCardView<
  IAceGroupViewerAdaptiveCardExtensionProps,
  IAceGroupViewerAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    console.log(this.state.memberCount);
    console.log(this.state.members);
    return {
      subTitle: strings.SubTitle,
      title: strings.Title,
      description: this.properties.description,
      memberCount: this.state.memberCount,
      groupName: this.state.groupName,
      members: this.state.members
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}