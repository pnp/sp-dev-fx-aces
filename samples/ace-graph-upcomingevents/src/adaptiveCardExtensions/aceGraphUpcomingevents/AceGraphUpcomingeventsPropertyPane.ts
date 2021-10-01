import { IPropertyPaneConfiguration, PropertyPaneSlider, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'AceGraphUpcomingeventsAdaptiveCardExtensionStrings';

export class AceGraphUpcomingeventsPropertyPane {
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
                PropertyPaneTextField('iconProperty', {
                  label: strings.IconPropertyFieldLabel
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,
                  multiline: true
                }),
                PropertyPaneSlider('days', {
                  label: 'Number of days to view in advance',
                  max: 7,
                  min: 1
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
