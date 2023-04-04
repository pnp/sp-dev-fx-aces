import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'ToDoCardAdaptiveCardExtensionStrings';

export class ToDoCardPropertyPane {
  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('apiUrl', {
                  label: strings.ApiUrlFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
