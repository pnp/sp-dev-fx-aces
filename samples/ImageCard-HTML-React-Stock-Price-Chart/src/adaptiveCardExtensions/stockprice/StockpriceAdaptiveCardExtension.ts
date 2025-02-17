import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { StockpricePropertyPane } from './StockpricePropertyPane';
import { IReadonlyTheme, ThemeProvider, ThemeChangedEventArgs } from '@microsoft/sp-component-base';

export interface IStockpriceAdaptiveCardExtensionProps {
  title: string;
  mainImage: string;
  companyName: string;
  stockSymbol: string;
  currency: string;
}

export interface IStockpriceAdaptiveCardExtensionState {
  theme: IReadonlyTheme | undefined;
}

const CARD_VIEW_REGISTRY_ID: string = 'Stockprice_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Stockprice_QUICK_VIEW';

export default class StockpriceAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IStockpriceAdaptiveCardExtensionProps,
  IStockpriceAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: StockpricePropertyPane;
  private themeProvider: ThemeProvider;
  private theme: IReadonlyTheme | undefined;

  public onInit(): Promise<void> {
    this.themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
    this.theme = this.themeProvider.tryGetTheme();
    this.themeProvider.themeChangedEvent.add(this, this.handleThemeChangedEvent);

    this.state = {
      theme: this.theme
    };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    // registers the quick view to open via QuickView action
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  private handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    this.setState({
      theme: args.theme
    });
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'Stockprice-property-pane'*/
      './StockpricePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.StockpricePropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }
}
