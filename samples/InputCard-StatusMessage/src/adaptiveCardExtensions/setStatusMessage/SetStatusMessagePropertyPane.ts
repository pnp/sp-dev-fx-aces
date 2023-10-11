import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'SetStatusMessageAdaptiveCardExtensionStrings';

export class SetStatusMessagePropertyPane {
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
                PropertyPaneTextField('validationText', {
                  label: strings.ValidationMessageLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
