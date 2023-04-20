import { IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import * as strings from 'AceFormsAdaptiveCardExtensionStrings';

export class AceFormsPropertyPane {
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
                PropertyPaneTextField('description', {
                  label: 'Card Description'
                }),
                PropertyPaneTextField('siteURL', {
                  label: 'SharePoint Site URL'
                }),
                PropertyPaneTextField('listId', {
                  label: 'List ID (GUID)'
                }),
                PropertyPaneToggle('showAllItems', {
                  label: 'Show all Items button?'
                }),
                PropertyPaneTextField('buttonText', {
                  label: 'All Items button text'
                }),
                PropertyPaneTextField('allItemsURL', {
                  label: 'All Items URL'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
