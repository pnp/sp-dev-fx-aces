import { IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneDropdown } from '@microsoft/sp-property-pane';
import * as strings from 'AceMyLocationAdaptiveCardExtensionStrings';

export class AceMyLocationPropertyPane {
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
                PropertyPaneTextField('listGUID', {
                  label: "List GUID",
                  description: "GUID of the list that contains the location/groupIDs and respective image and page URLs"
                }),
                 PropertyPaneTextField('description', {
                  label: "Card Description",
                  multiline: true,
                  description: "Use '{Location}' to insert the dynamic location name. E.g. 'Click here to access the {Location} Site'."
                }),
                PropertyPaneTextField('imageUrl', {
                  label: "Default Image URL",
                  description: "Fallback image if no entry is found for current user"
                }),
                 PropertyPaneTextField('defaultUrl', {
                  label: "Default Location URL",
                  multiline: false,
                  description: "Fallback URL if no entry is found for current user"
                }),
                 PropertyPaneTextField('defaultLocationName', {
                  label: "Default Location Name",
                  multiline: false,
                  description: "Fallback location name if no entry is found for current user"
                }),
                PropertyPaneDropdown('mode', {
                  label: 'Selection Mode',
                  options: [
                    { key: 'officeLocation', text: 'Based on Office Location (Azure AD)' },
                    { key: 'groupMembership', text: 'Based on Azure AD Group Membership' }
                  ],
                  selectedKey: 'officeLocation'
                }),
                PropertyPaneTextField('fabricIconName', {
                  label: 'Fabric UI Icon Name',
                  description: 'E.g., "Home", "HomeGroup", "Globe" from https://uifabricicons.azurewebsites.net/',
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
