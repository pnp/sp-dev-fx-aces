import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'FilesByContentTypeAdaptiveCardExtensionStrings';
import { IFilesByContentTypeAdaptiveCardExtensionProps } from './FilesByContentTypeAdaptiveCardExtension';

export class FilesByContentTypePropertyPane {
  public getPropertyPaneConfiguration(properties: IFilesByContentTypeAdaptiveCardExtensionProps, context: unknown, p0: any): IPropertyPaneConfiguration {
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
                PropertyPaneTextField('siteAddress', {
                  label: strings.SiteAddressFieldLabel
                }),
                PropertyPaneTextField('listTitle', {
                  label: strings.ListTitleFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
