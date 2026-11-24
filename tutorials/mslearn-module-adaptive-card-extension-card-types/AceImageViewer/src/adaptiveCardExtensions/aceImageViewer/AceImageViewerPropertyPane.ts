import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'AceImageViewerAdaptiveCardExtensionStrings';

export class AceImageViewerPropertyPane {
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
                PropertyPaneTextField('searchQuery', {
                  label: 'NASA image search term'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
