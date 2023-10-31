import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'SamplesSearchAdaptiveCardExtensionStrings';

export class SamplesSearchPropertyPane {
  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('searchServiceUri', {
                  label: strings.SearchServiceUriFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
