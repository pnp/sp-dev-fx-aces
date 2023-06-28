import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'TechnicalSupportChatAdaptiveCardExtensionStrings';

export class TechnicalSupportChatPropertyPane {
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
                PropertyPaneTextField('supportSpecialistEmail', {
                  label: strings.SupportSpecialistEmailFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
