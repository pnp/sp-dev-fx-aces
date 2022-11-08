import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'StockBitcoinFeedAdaptiveCardExtensionStrings';

export class StockBitcoinFeedPropertyPane {
  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('finnhubtoken',{
                  label: strings.Finnhubtoken
                }),
                PropertyPaneTextField('finnhubsymbol',{
                  label: strings.Finnhubsymbol
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
