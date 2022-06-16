import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SecurityMonitorAdaptiveCardExtensionStrings';
import { USER_VIEW_REGISTRY_ID, ISecurityMonitorAdaptiveCardExtensionProps, ISecurityMonitorAdaptiveCardExtensionState, RISK_VIEW_REGISTRY_ID } from '../SecurityMonitorAdaptiveCardExtension';

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

  public onAction(action: IActionArguments): void {
    switch (action.id) {
      case "riskyUsers":
        this.quickViewNavigator.push(USER_VIEW_REGISTRY_ID);
        break;
      case "idRisk":
        //call api and set state
        this.quickViewNavigator.push(RISK_VIEW_REGISTRY_ID);
        break;
      default:
        break;
    }
  }
}