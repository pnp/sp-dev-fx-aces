import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { SecurityMonitorPropertyPane } from './SecurityMonitorPropertyPane';
import { DashboardView } from './dashboardView/DashboardView';

export interface ISecurityMonitorAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
  isloadDemoData: boolean;
}

export interface ISecurityMonitorAdaptiveCardExtensionState {
  categories: any[];
}

const CARD_VIEW_REGISTRY_ID: string = 'SecurityMonitor_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'SecurityMonitor_QUICK_VIEW';
export const DASBOARD_VIEW_REGISTRY_ID: string = 'SecurityMonitor_DASHBOARD_VIEW';

export default class SecurityMonitorAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ISecurityMonitorAdaptiveCardExtensionProps,
  ISecurityMonitorAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: SecurityMonitorPropertyPane | undefined;

  public onInit(): Promise<void> {
    const { categories } = require('../../services/demoData/DashboardData.json');
    this.state = {
      categories: this.properties.isloadDemoData ? categories : []
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    this.quickViewNavigator.register(DASBOARD_VIEW_REGISTRY_ID, () => new DashboardView());

    return Promise.resolve();
  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'SecurityMonitor-property-pane'*/
      './SecurityMonitorPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.SecurityMonitorPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
}
