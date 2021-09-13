import { IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import * as strings from 'NewsGlanceAdaptiveCardExtensionStrings';
import { INewsGlanceAdaptiveCardExtensionProps } from './NewsGlanceAdaptiveCardExtension';

export class NewsGlancePropertyPane {
  public getPropertyPaneConfiguration(
    properties: INewsGlanceAdaptiveCardExtensionProps
  ): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: "Properties" },
          groups: [
            {
              groupName: "Card settings",
              groupFields: [
                PropertyPaneTextField('iconProperty', {
                  label: strings.IconPropertyFieldLabel
                }),
                PropertyPaneTextField('id', {
                  label: "The Id of the news article"
                }),
                PropertyPaneTextField('numberOfSentences', {
                  label: "Number of sentences to get",
                  disabled: properties.showStaticContent
                }),
                PropertyPaneToggle('showStaticContent', {
                  label: "Show static content"
                }),
                PropertyPaneTextField('firstContent', {
                  label: "First summary sentence",
                  multiline: true,
                  disabled: !properties.showStaticContent
                }),
                PropertyPaneTextField('secondContent', {
                  label: "Second summary sentence",
                  multiline: true,
                  disabled: !properties.showStaticContent
                }),
                PropertyPaneTextField('thirdContent', {
                  label: "Third summary sentence",
                  multiline: true,
                  disabled: !properties.showStaticContent
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
