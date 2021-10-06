import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'WeatherAdaptiveCardExtensionStrings';

export class WeatherPropertyPane {
  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel,
                  value: strings.Title,
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,
                  value: strings.Description
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
