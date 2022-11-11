import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { StockBitcoinFeedPropertyPane } from './StockBitcoinFeedPropertyPane';

export interface IStockBitcoinFeedAdaptiveCardExtensionProps {
  title: string;
  finnhubtoken: string;
  finnhubsymbol: string;
  description: string;
}

export interface IStockBitcoinFeedAdaptiveCardExtensionState {
  lastPrice: number;
}

const CARD_VIEW_REGISTRY_ID: string = 'StockBitcoinFeed_CARD_VIEW';

export default class StockBitcoinFeedAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IStockBitcoinFeedAdaptiveCardExtensionProps,
  IStockBitcoinFeedAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: StockBitcoinFeedPropertyPane | undefined;

  public onInit(): Promise<void> {
    if (!!this.properties.finnhubtoken && !!this.properties.finnhubsymbol) {
      const socket: WebSocket = new WebSocket(`wss://ws.finnhub.io?token=${this.properties.finnhubtoken}`);
      socket.addEventListener('open', () => {
        socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': this.properties.finnhubsymbol }));
      });
      socket.addEventListener('message', (event) => {
        console.log(event.data);
        const response = JSON.parse(event.data);
        switch (response.type) {
          case 'trade':
            this.setState({ lastPrice: response.data[0].p });
            break;
          case 'ping':
            console.log('occasional server connect');
            break
          default:
            console.log(response);
            break;
        }
      });
    }
    this.state = { lastPrice: 0.0 };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'StockBitcoinFeed-property-pane'*/
      './StockBitcoinFeedPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.StockBitcoinFeedPropertyPane();
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
