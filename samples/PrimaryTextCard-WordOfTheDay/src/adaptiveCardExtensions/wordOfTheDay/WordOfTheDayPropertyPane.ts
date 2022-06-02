import { IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import * as strings from 'WordOfTheDayAdaptiveCardExtensionStrings';

export class WordOfTheDayPropertyPane {
  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneTextField('apiKey', {
                  label: strings.ApiKeyFieldLabel,
                }),
                PropertyPaneToggle('useSampleData', {
                  label: strings.UseSampleDataFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
