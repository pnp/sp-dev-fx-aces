import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';

import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { spfi, SPFx } from "@pnp/sp";

import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { StocktickterPropertyPane } from './StocktickterPropertyPane';
import { Stock } from '../../models/cg.models';
import { cg } from '../../services/cg.service';

export interface IStocktickterAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
}

export interface IStocktickterAdaptiveCardExtensionState {
  stock: Stock;
}

const CARD_VIEW_REGISTRY_ID: string = 'Stocktickter_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Stocktickter_QUICK_VIEW';

export default class StocktickterAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IStocktickterAdaptiveCardExtensionProps,
  IStocktickterAdaptiveCardExtensionState
> {
  private LOG_SOURCE: string = "🔶 StocktickterAdaptiveCardExtension";
  private _deferredPropertyPane: StocktickterPropertyPane | undefined;

  public async onInit(): Promise<void> {
    try {
      //Initialize PnPLogger
      Logger.subscribe(ConsoleListener());
      Logger.activeLogLevel = LogLevel.Info;

      //Initialize PnPJs
      spfi().using(SPFx(this.context));

      cg.Init();

      const stock: Stock = await cg.GetStocks();

      this.state = {
        stock: stock
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

  public get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'Stocktickter-property-pane'*/
      './StocktickterPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.StocktickterPropertyPane();
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
