import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView,ErrorView,SuccessView } from "./quickView/index";
import { MyTeamPropertyPane } from './MyTeamPropertyPane';
import { IConfig } from "../../models/models";
import { Service } from "../../services/service";
import { Logger, LogLevel } from '@pnp/logging/logger';
import { ConsoleListener } from '@pnp/logging/listeners';
import { graph } from '@pnp/graph';
import { MSGraphClient } from "@microsoft/sp-http";
export interface IMyTeamAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
}

export interface IMyTeamAdaptiveCardExtensionState {
  currentIndex:number;
  currentConfig: IConfig;
  service: Service;
}

const CARD_VIEW_REGISTRY_ID: string = 'MyTeam_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'MyTeam_QUICK_VIEW';
export const ERROR_VIEW_REGISTRY_ID: string = 'MyTeam_ERROR_VIEW';
export const SUCCESS_VIEW_REGISTRY_ID:string = 'MyTeam_SUCCESS_VIEW';

export default class MyTeamAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IMyTeamAdaptiveCardExtensionProps,
  IMyTeamAdaptiveCardExtensionState
> {
  // Private variables
  private LOG_SOURCE: string = "🔶MyTeamAdaptiveCardExtension";
  private _deferredPropertyPane: MyTeamPropertyPane | undefined;
  private service: Service = new Service();
  private _client = MSGraphClient;


  /** onInit functiont get records and store it in config file. */
  public async onInit(): Promise<void> {
    Logger.subscribe(new ConsoleListener());
    Logger.activeLogLevel = LogLevel.Info;
    try {
      graph.setup({ spfxContext: this.context });
      const client = await this.context.msGraphClientFactory.getClient();
      await this.service.Init(client);
      this.state = {
        currentIndex:0,
        currentConfig: this.service.Config,
        service:this.service
      };
    } catch (error) {
      Logger.write(`${this.LOG_SOURCE} (_directReportsToMe) - ${error} - `, LogLevel.Error);
    }

    // Register CardView and QuickView to Card navigator and quick view navigator.
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    this.quickViewNavigator.register(ERROR_VIEW_REGISTRY_ID, () => new ErrorView());
    this.quickViewNavigator.register(SUCCESS_VIEW_REGISTRY_ID, () => new SuccessView());
    return Promise.resolve();
  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/microsoft-teams.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'MyTeam-property-pane'*/
      './MyTeamPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.MyTeamPropertyPane();
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
