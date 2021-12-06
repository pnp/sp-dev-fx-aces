import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'UnreadEmailsAdaptiveCardExtensionStrings';

export class UnreadEmailsPropertyPane {
    public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
        return {
          pages: [
            {
              header: { description: strings.PropertyPaneDescription },
              groups: [
                {
                  groupName: strings.BasicGroupName,
                  groupFields: [
                    PropertyPaneTextField('iconProperty', {
                      label: strings.IconPropertyFieldLabel
                    }),
                  ]
                }
              ]
            }
          ]
        };
      }
}
