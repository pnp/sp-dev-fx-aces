import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'StockpriceAdaptiveCardExtensionStrings';

export class StockpricePropertyPane {
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
                PropertyPaneTextField('mainImage', {
                  label: "Image to show on the card"
                }),
                PropertyPaneTextField('companyName', {
                  label: "Company Name"
                }),
                PropertyPaneTextField('stockSymbol', {
                  label: "Stock Symbol"
                }),
                PropertyPaneTextField('currency', {
                  label: "Currency"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
