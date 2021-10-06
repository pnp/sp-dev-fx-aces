import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';

import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { sp } from "@pnp/sp";

import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { VideocardPropertyPane } from './VideocardPropertyPane';
import { cg } from '../../services/cg.service';
import { Video } from '../../models/cg.models';

export interface IVideocardAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
}

export interface IVideocardAdaptiveCardExtensionState {
  currentIndex: number;
  videos: Video[];
}

const CARD_VIEW_REGISTRY_ID: string = 'Videocard_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Videocard_QUICK_VIEW';

export default class VideocardAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IVideocardAdaptiveCardExtensionProps,
  IVideocardAdaptiveCardExtensionState
> {
  private LOG_SOURCE: string = "🔶 VideocardAdaptiveCardExtension";
  private _deferredPropertyPane: VideocardPropertyPane | undefined;

  public onInit(): Promise<void> {
    try {
      //Initialize PnPLogger
      Logger.subscribe(new ConsoleListener());
      Logger.activeLogLevel = LogLevel.Info;

      //Initialize PnPJs
      sp.setup({ spfxContext: this.context });

      cg.Init();

      const videos: Video[] = cg.GetVideos();

      this.state = {
        currentIndex: 0,
        videos: videos,
      };

      this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
      this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onInit) - ${err}`, LogLevel.Error);
    }
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
      /* webpackChunkName: 'Videocard-property-pane'*/
      './VideocardPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.VideocardPropertyPane();
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
