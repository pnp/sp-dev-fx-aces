import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';

import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { sp } from "@pnp/sp";

import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { CompanynewsPropertyPane } from './CompanynewsPropertyPane';
import { Article } from '../../models/cg.models';
import { cg } from '../../services/cg.service';

export interface ICompanynewsAdaptiveCardExtensionProps {
  homeSite: string;
  title: string;
  description: string;
}

export interface ICompanynewsAdaptiveCardExtensionState {
  currentArticleId: number;
  articles: Article[];
}

const CARD_VIEW_REGISTRY_ID: string = 'Companynews_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Companynews_QUICK_VIEW';

export default class CompanynewsAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ICompanynewsAdaptiveCardExtensionProps,
  ICompanynewsAdaptiveCardExtensionState
> {
  private LOG_SOURCE: string = "🔶 CompanynewsAdaptiveCardExtension";

  private _deferredPropertyPane: CompanynewsPropertyPane | undefined;

  public onInit(): Promise<void> {
    try {
      //Initialize PnPLogger
      Logger.subscribe(new ConsoleListener());
      Logger.activeLogLevel = LogLevel.Info;

      //Initialize PnPJs
      sp.setup({ spfxContext: this.context });

      cg.Init();

      const articles: Article[] = cg.GetArticles();

      this.state = {
        currentArticleId: 0,
        articles: articles
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

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'Companynews-property-pane'*/
      './CompanynewsPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.CompanynewsPropertyPane();
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
