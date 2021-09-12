import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { IssuesView } from './issuesView/IssuesView';
import { ServiceHealthOverviewPropertyPane } from './ServiceHealthOverviewPropertyPane';
import { MSGraph } from '../msgraph';
import { getHealthOverview, getIconForService } from '../serviceHealth';
import { Issue, Service, ServiceHealthIssues } from '../types';
import { ErrorCardView } from './cardView/ErrorCardView';
import { IssuesDetailsView } from './issuesDetailsView/IssuesDetailsView';
import _ from 'lodash';
import { InformationCardView } from './cardView/InformationCardView';
import { getThemeColor } from '../themehelper';

export interface IServiceHealthOverviewAdaptiveCardExtensionProps {
  title: string;
}

export interface IServiceHealthOverviewAdaptiveCardExtensionState {
  serviceHealthIssues: ServiceHealthIssues;
  services: Service[];
  selectedService: string;
  errorMessage: string;
  cardViewToRender: string;
}

const CARD_VIEW_REGISTRY_ID: string = 'ServiceHealthOverview_CARD_VIEW';
const INFO_CARD_VIEW_REGISTRY_ID: string = 'ServiceHealthOverview_INFO_CARD_VIEW';
export const ISSUES_VIEW_REGISTRY_ID: string = 'ServiceHealthOverview_ISSUES_VIEW';
export const ISSUES_DETAILS_VIEW_REGISTRY_ID: string = 'ServiceHealthOverview_ISSUES_DETAILS_VIEW';
const ERROR_CARD_VIEW_REGISTRY_ID: string = 'TfLStatus_ERROR_CARD_VIEW';

export default class ServiceHealthOverviewAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IServiceHealthOverviewAdaptiveCardExtensionProps,
  IServiceHealthOverviewAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: ServiceHealthOverviewPropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      serviceHealthIssues: null,
      services: null,
      selectedService: "",
      errorMessage: "",
      cardViewToRender: CARD_VIEW_REGISTRY_ID
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.cardNavigator.register(INFO_CARD_VIEW_REGISTRY_ID, () => new InformationCardView());
    this.quickViewNavigator.register(ISSUES_VIEW_REGISTRY_ID, () => new IssuesView());
    this.quickViewNavigator.register(ISSUES_DETAILS_VIEW_REGISTRY_ID, () => new IssuesDetailsView());
    this.cardNavigator.register(ERROR_CARD_VIEW_REGISTRY_ID, () => new ErrorCardView());

    await MSGraph.Init(this.context);
    await this.loadIssues();
    return Promise.resolve();
  }

  private async loadIssues(): Promise<void> {


    setTimeout(async () => {
      let serviceHealthIssues: ServiceHealthIssues = await getHealthOverview();

      if (serviceHealthIssues === null) {
        this.setState({
          cardViewToRender: ERROR_CARD_VIEW_REGISTRY_ID,
          errorMessage: "Please check logs"
        });
        this.cardNavigator.replace(this.state.cardViewToRender);
        return;
      }

      if (serviceHealthIssues['@odata.count'] === 0) {
        this.setState({
          cardViewToRender: INFO_CARD_VIEW_REGISTRY_ID
        });
        this.cardNavigator.replace(this.state.cardViewToRender);
        return;
      }

      const fillColour = getThemeColor("themeLighterAlt").replace('#', '%23');

      const services: Service[] =
        _(serviceHealthIssues.value)
          .groupBy('service')
          .map((items, service: string) => ({
            name: service,
            issues: items.map(i => ({
              title: i.title,
              url: `https://admin.microsoft.com/#/servicehealth/:/alerts/${i.id}`
            })),
            numberOfIssues: `${items.length.toString()} issue${items.length > 1 ? 's' : ''}`,
            serviceIcon: getIconForService(service),
            actionIcon: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath d='M4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24ZM23.8661 32.6339C23.378 32.1457 23.378 31.3543 23.8661 30.8661L29.4822 25.25H15.25C14.5596 25.25 14 24.6904 14 24C14 23.3096 14.5596 22.75 15.25 22.75H29.4822L23.8661 17.1339C23.378 16.6457 23.378 15.8543 23.8661 15.3661C24.3543 14.878 25.1457 14.878 25.6339 15.3661L33.3839 23.1161C33.872 23.6043 33.872 24.3957 33.3839 24.8839L25.6339 32.6339C25.1457 33.122 24.3543 33.122 23.8661 32.6339Z' fill='${fillColour}'%3E%3C/path%3E%3C/svg%3E`
          }))
          .value();

      this.setState({
        serviceHealthIssues,
        services
      });
    }, 300);
  }

  public get title(): string {
    return this.properties.title;
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'ServiceHealthOverview-property-pane'*/
      './ServiceHealthOverviewPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.ServiceHealthOverviewPropertyPane();
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
