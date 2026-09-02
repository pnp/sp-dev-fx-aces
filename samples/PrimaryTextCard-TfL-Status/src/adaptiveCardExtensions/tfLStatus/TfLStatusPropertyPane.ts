import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';

export class TfLStatusPropertyPane {
  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: "Properties" },
          groups: [
            {
              groupName: "Settings",
              groupFields: [
                PropertyPaneTextField('favLineExtensionName', {
                  label: "Favourite line extension name"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
