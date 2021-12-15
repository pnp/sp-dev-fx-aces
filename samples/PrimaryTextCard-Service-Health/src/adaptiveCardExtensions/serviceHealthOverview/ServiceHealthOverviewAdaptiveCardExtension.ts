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
            serviceIcon: getIconForService(service)
          }))
          .value();

          console.debug("Service health issues grouped by service %o", services);

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
