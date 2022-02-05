import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { DetailUserView } from './detailUserView/DetailUserView';
import { SecurityMonitorPropertyPane } from './SecurityMonitorPropertyPane';
import { DashboardView } from './dashboardView/DashboardView';
import { DetailRiskView } from './detailRiskView/DetailRiskView';
import { graphService } from '../../services/GraphDataService';
import { formatCategoriesData, formatDefaultCategoriesData } from '../../common/Utility';

export interface ISecurityMonitorAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
  isloadDemoData: boolean;
  maxRiskDetectionCount: number;
  maxRiskyUserCount: number;
}

export interface ISecurityMonitorAdaptiveCardExtensionState {
  categories: any[];
  riskData: any[];
  userData: any[];
}

const CARD_VIEW_REGISTRY_ID: string = 'SecurityMonitor_CARD_VIEW';
export const DASBOARD_VIEW_REGISTRY_ID: string = 'SecurityMonitor_DASHBOARD_VIEW';
export const RISK_VIEW_REGISTRY_ID: string = 'SecurityMonitor_RISK_VIEW';
export const USER_VIEW_REGISTRY_ID: string = 'SecurityMonitor_USER_VIEW';

export default class SecurityMonitorAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ISecurityMonitorAdaptiveCardExtensionProps,
  ISecurityMonitorAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: SecurityMonitorPropertyPane | undefined;

  public onInit(): Promise<void> {
    graphService.setContext(this.context);

    const { categories } = require('../../services/demoData/DashboardData.json');
    const { riskData } = require('../../services/demoData/DetailRiskData.json');
    const { userData } = require('../../services/demoData/DetailUserData.json');

    this.state = {
      categories: this.properties.isloadDemoData ? categories : formatDefaultCategoriesData(categories),
      riskData: this.properties.isloadDemoData ? riskData : [],
      userData: this.properties.isloadDemoData ? userData : []
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(DASBOARD_VIEW_REGISTRY_ID, () => new DashboardView());
    this.quickViewNavigator.register(RISK_VIEW_REGISTRY_ID, () => new DetailRiskView());
    this.quickViewNavigator.register(USER_VIEW_REGISTRY_ID, () => new DetailUserView());

    const squery = `&$top=${this.properties.maxRiskyUserCount ? this.properties.maxRiskyUserCount : 10}`;
    const rquery = `&$top=${this.properties.maxRiskDetectionCount ? this.properties.maxRiskDetectionCount : 10}`;
    return !this.properties.isloadDemoData ?
      graphService.getRiskyUserData(squery).then(uData => {
        if (uData && uData.value) {
          this.setState({ userData: uData.value });
        }
        return uData && uData.value ? uData.value.length : 0;
      }).then((uCount) => {
        graphService.getIdentityRiskData(rquery).then(rData => {
          if (rData && rData.value) {
            const catTemp = this.state.categories;
            this.setState({
              riskData: rData.value,
              categories: formatCategoriesData(catTemp, uCount, rData.value.length)
            });
          }
        });
      }) : Promise.resolve();
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
