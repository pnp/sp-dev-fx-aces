import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseWebQuickView } from '@microsoft/sp-adaptive-card-extension-base';
import { isEmpty } from '@microsoft/sp-lodash-subset';
// import * as strings from 'StockpriceAdaptiveCardExtensionStrings';
import {
  IStockpriceAdaptiveCardExtensionProps,
  IStockpriceAdaptiveCardExtensionState
} from '../StockpriceAdaptiveCardExtension';
import StockPriceWidget  from './components/StockPriceWidget';

export class QuickView extends BaseWebQuickView<
  IStockpriceAdaptiveCardExtensionProps,
  IStockpriceAdaptiveCardExtensionState
> {
  render(): void {
    let { stockSymbol, currency } = this.properties;
    // set stockSymbol to 'MSFT' if it is empty
    if (isEmpty(stockSymbol)) {
      stockSymbol = 'MSFT';
    }

    // set currency to 'GBP' if it is empty
    if (isEmpty(currency)) {
      currency = 'GBP';
    }

    const element: React.ReactElement<{}> = React.createElement(StockPriceWidget, {
      stockSymbol,
      currency
    });
    ReactDOM.render(element, this.domElement);
  }

  public onDispose(): void {
    ReactDOM.unmountComponentAtNode(this.domElement);
    super.dispose();
  }
}
