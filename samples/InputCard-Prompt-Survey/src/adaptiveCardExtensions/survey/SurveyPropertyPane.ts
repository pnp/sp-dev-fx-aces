import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'SurveyAdaptiveCardExtensionStrings';

export class SurveyPropertyPane {
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
                PropertyPaneTextField('question', {
                  label: strings.QuestionFieldLabel
                }),
                PropertyPaneTextField('thankYouText', {
                  label: strings.ThankYouFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
