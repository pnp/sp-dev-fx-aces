import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'GenericTextImageButtonAdaptiveCardExtensionStrings';

export class GenericTextImageButtonPropertyPane {
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
