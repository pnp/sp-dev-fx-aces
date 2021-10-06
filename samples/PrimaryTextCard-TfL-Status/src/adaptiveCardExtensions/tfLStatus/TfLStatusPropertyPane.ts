import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'TfLStatusAdaptiveCardExtensionStrings';

export class TfLStatusPropertyPane {
  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: "Properties" },
          groups: [
            {
              groupName: "Settings",
              groupFields: [
                PropertyPaneTextField('favLineExtensionName', {
                  label: "Favourite line extension name"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
