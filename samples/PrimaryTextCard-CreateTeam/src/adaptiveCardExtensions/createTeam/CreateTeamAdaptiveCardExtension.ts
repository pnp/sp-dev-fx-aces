import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView,ErrorView,SuccessView,LoadingView } from "./quickView/index";
import { CreateTeamPropertyPane } from './CreateTeamPropertyPane';
import { Logger, LogLevel } from '@pnp/logging/logger';
import { ConsoleListener } from '@pnp/logging/listeners';
import { graph } from '@pnp/graph';
import { Service } from "../../Services/Service";
export interface ICreateTeamAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;

}

export interface ICreateTeamAdaptiveCardExtensionState {
  service: Service;
}

const CARD_VIEW_REGISTRY_ID: string = 'CreateTeam_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'CreateTeam_QUICK_VIEW';
export const ERROR_VIEW_REGISTRY_ID:string = 'CreateTeam_ERROR_VIEW';
export const SUCCESS_VIEW_REGISTRY_ID:string = 'CreateTeam_SUCCESS_VIEW';
export const LOADING_VIEW_REGISTRY_ID:string = 'CreateTeam_LOADING_VIEW';
export default class CreateTeamAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ICreateTeamAdaptiveCardExtensionProps,
  ICreateTeamAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: CreateTeamPropertyPane | undefined;
  private LOG_SOURCE: string = "🔶CreateTeamAdaptiveCardExtension";
  private service: Service = new Service();
  public async onInit(): Promise<void> {
    Logger.subscribe(new ConsoleListener());
    Logger.activeLogLevel = LogLevel.Info;
    try {
      graph.setup({ spfxContext: this.context });
      const client = await this.context.msGraphClientFactory.getClient();
      await this.service.Init(client);

    } catch (error) {
      Logger.write(`${this.LOG_SOURCE} (_directReportsToMe) - ${error} - `, LogLevel.Error);
    }
    this.state = {
      service: this.service
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    this.quickViewNavigator.register(ERROR_VIEW_REGISTRY_ID, () => new ErrorView());
    this.quickViewNavigator.register(SUCCESS_VIEW_REGISTRY_ID,()=>new SuccessView());
    this.quickViewNavigator.register(LOADING_VIEW_REGISTRY_ID,()=>new LoadingView());
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
      /* webpackChunkName: 'CreateTeam-property-pane'*/
      './CreateTeamPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.CreateTeamPropertyPane();
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
