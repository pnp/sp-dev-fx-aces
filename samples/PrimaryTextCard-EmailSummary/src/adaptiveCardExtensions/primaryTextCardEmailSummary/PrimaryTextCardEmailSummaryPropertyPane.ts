import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'PrimaryTextCardEmailSummaryAdaptiveCardExtensionStrings';

export class PrimaryTextCardEmailSummaryPropertyPane {
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
                PropertyPaneTextField('copilotApiPath', {
                  label: 'Copilot API path',
                  description: 'Use the full Graph conversations URL, for example: https://graph.microsoft.com/beta/copilot/conversations',
                  placeholder: 'https://graph.microsoft.com/beta/copilot/conversations'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
