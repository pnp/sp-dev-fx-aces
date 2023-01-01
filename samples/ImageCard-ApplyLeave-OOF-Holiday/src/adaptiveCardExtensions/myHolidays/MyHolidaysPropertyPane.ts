import { IPropertyPaneConfiguration, PropertyPaneDropdown, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'MyHolidaysAdaptiveCardExtensionStrings';

export class MyHolidaysPropertyPane {
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
                PropertyPaneDropdown('dropdownProperty', { 
                  label: 'Country',                  
                  options: [ 
                    { key: 'in', text: 'India' }, 
                    { key: 'us', text: 'USA' }, 
                    { key: 'uk', text: 'UK' }, 
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
