import * as strings from 'M365ServiceHealthAdaptiveCardExtensionStrings';

import { IPropertyPaneConfiguration, PropertyPaneChoiceGroup, PropertyPaneTextField } from '@microsoft/sp-property-pane';

export class M365ServiceHealthPropertyPane {
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
                PropertyPaneChoiceGroup('scope', {
                  label: strings.ScopeFieldLabel,
                  options: [
                    {
                      key: 'admins',
                      text: strings.ScopeAdminsOptionText,
                      iconProps: {
                        officeFabricIconFontName: 'SecurityGroup',
                      },
                      checked: true
                      
                    },
                    {
                      key: 'all',
                      text: strings.ScopeAllOptionText,
                      iconProps: {
                        officeFabricIconFontName: 'People'
                      },
                      checked: false
                    }
                  ]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
