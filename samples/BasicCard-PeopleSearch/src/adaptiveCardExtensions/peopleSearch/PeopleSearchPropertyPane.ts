import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'PeopleSearchAdaptiveCardExtensionStrings';

export class PeopleSearchPropertyPane {
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
                PropertyPaneTextField('icon',{
                  label: strings.IconFieldLabel
                }),
                PropertyPaneTextField('cardText',{
                  label: strings.CardTextFieldLabel
                }),
                PropertyPaneTextField('cardButtonText',{
                  label: strings.CardButtonTextFieldLabel
                }),
                PropertyPaneTextField('defaultMessageText',{
                  label: strings.DefaultMessageText
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
