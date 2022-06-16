import { IPropertyPaneConfiguration, PropertyPaneTextField,PropertyPaneCheckbox,PropertyPaneDropdown } from '@microsoft/sp-property-pane';
import * as strings from 'FollowDocumentAcEsAdaptiveCardExtensionStrings';

export class FollowDocumentAcEsPropertyPane {
  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('URL', {
                  label: strings.URL,
                  value: 'https://www.bing.com',
                }),
                PropertyPaneDropdown('view', {
                  label: strings.view,
                  selectedKey: 'Slider',
                  options: [
                    { key: 'Slider', text: 'Slider' },
                    { key: 'List', text: 'List' },
                  ]
                }),
                PropertyPaneCheckbox("MockupData",{
                  text: strings.MockupData
                }),
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneTextField('iconProperty', {
                  label: strings.IconPropertyFieldLabel
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,
                  multiline: true
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
