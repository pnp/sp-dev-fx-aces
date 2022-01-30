import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SecurityMonitorAdaptiveCardExtensionStrings';
import { ISecurityMonitorAdaptiveCardExtensionProps, ISecurityMonitorAdaptiveCardExtensionState } from '../SecurityMonitorAdaptiveCardExtension';

export interface IDashboardData {
  categories: any[];
}

export class DashboardView extends BaseAdaptiveCardView<
  ISecurityMonitorAdaptiveCardExtensionProps,
  ISecurityMonitorAdaptiveCardExtensionState,
  IDashboardData
> {
  public get data(): IDashboardData {
    return {
      categories: this.state.categories
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/DashboardViewTemplate.json');
  }
}