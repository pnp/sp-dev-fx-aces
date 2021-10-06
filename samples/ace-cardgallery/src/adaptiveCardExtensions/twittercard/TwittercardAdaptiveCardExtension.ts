import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';

import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { sp } from "@pnp/sp";

import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { TwittercardPropertyPane } from './TwittercardPropertyPane';
import { Tweet } from '../../models/cg.models';
import { cg } from '../../services/cg.service';

export interface ITwittercardAdaptiveCardExtensionProps {
  title: string;
  description: string;
}

export interface ITwittercardAdaptiveCardExtensionState {
  currentTweetId: number;
  tweets: Tweet[];
}

const CARD_VIEW_REGISTRY_ID: string = 'Twittercard_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Twittercard_QUICK_VIEW';

export default class TwittercardAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ITwittercardAdaptiveCardExtensionProps,
  ITwittercardAdaptiveCardExtensionState
> {

  private LOG_SOURCE: string = "🔶 TwittercardAdaptiveCardExtension";

  private _deferredPropertyPane: TwittercardPropertyPane | undefined;

  public onInit(): Promise<void> {
    try {
      //Initialize PnPLogger
      Logger.subscribe(new ConsoleListener());
      Logger.activeLogLevel = LogLevel.Info;

      //Initialize PnPJs
      sp.setup({ spfxContext: this.context });

      cg.Init();

      const tweets: Tweet[] = cg.GetTweets();

      this.state = {
        currentTweetId: 0,
        tweets: tweets
      };

      this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
      this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (data) - ${err}`, LogLevel.Error);
    }

    return Promise.resolve();
  }

  public get title(): string {
    return this.properties.title;
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'Twittercard-property-pane'*/
      './TwittercardPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.TwittercardPropertyPane();
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
