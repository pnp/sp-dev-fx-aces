import { IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import * as strings from 'WorkIQTodaySummaryAdaptiveCardExtensionStrings';

export class WorkIQTodaySummaryPropertyPane {
  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.GeneralGroupName,
              groupFields: [
                PropertyPaneTextField('cardTitle', {
                  label: strings.CardTitleFieldLabel
                }),
                PropertyPaneTextField('refreshIntervalMinutes', {
                  label: strings.RefreshIntervalFieldLabel,
                  value: '60'
                }),
                PropertyPaneToggle('includeTeamsMessages', {
                  label: strings.IncludeTeamsMessagesFieldLabel,
                  onText: 'On',
                  offText: 'Off'
                })
              ]
            },
            {
              groupName: strings.ProxyGroupName,
              groupFields: [
                PropertyPaneTextField('proxyFunctionUrl', {
                  label: strings.ProxyFunctionUrlFieldLabel,
                  placeholder: 'https://<your-function-app>.azurewebsites.net'
                }),
                PropertyPaneTextField('proxyResourceId', {
                  label: strings.ProxyResourceIdFieldLabel,
                  placeholder: 'api://<your-function-app-client-id>'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
