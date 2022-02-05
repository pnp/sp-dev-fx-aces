import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SecurityMonitorAdaptiveCardExtensionStrings';
import { securityCenterUrl } from '../../../common/Constants';
import { ISecurityMonitorAdaptiveCardExtensionProps, ISecurityMonitorAdaptiveCardExtensionState } from '../SecurityMonitorAdaptiveCardExtension';

export interface IDetailUserViewData {
  userData: any[];
  moreLink: string;
}

export class DetailUserView extends BaseAdaptiveCardView<
  ISecurityMonitorAdaptiveCardExtensionProps,
  ISecurityMonitorAdaptiveCardExtensionState,
  IDetailUserViewData
> {
  public get data(): IDetailUserViewData {
    return {
      userData: this.state.userData,
      moreLink: securityCenterUrl
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/DetailUserViewTemplate.json');
  }
}