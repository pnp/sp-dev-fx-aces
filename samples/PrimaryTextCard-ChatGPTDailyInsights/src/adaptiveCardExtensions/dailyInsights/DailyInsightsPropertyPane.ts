import { IPropertyPaneConfiguration, IPropertyPaneDropdownOption, PropertyPaneDropdown, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'DailyInsightsAdaptiveCardExtensionStrings';

const prompts: IPropertyPaneDropdownOption[] = [
  { key: "Quote of the day", text: "Quote of the day" },
  { key: "Fact of the day", text: "Fact of the day" },
  { key: "Tip of the day", text: "Tip of the day" },
  { key: "What happenend today in History", text: "Today in History" },
  { key: "Grammar Tip", text: "Grammar Tip of the Day" },
  { key: "Motivational wisdom", text: "Motivational Quote" },
  { key: "Life Hack of the day", text: "Life Hack" },
  { key: "Health tip of the day", text: "Health Tip" },
  { key: "Meditation tip of the day", text: "Meditation Tip" },
  { key: "Coding tip", text: "Programming Tip" },
];
export class DailyInsightsPropertyPane {

  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('cardtitle', {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneTextField('apiKey', {
                  label: strings.ApiKeyFieldLabel
                }),
                PropertyPaneTextField('maxToken', {
                  label: "Max Token",
                  value: "250"
                }),
                PropertyPaneTextField('model', {
                  label: "Model",
                  value: "text-davinci-003"
                }),
                PropertyPaneDropdown('category', {
                  label: "Select Prompt",
                  options: prompts,
                  selectedKey: "Quote of the day"
                }),
                PropertyPaneTextField('primarytext', {
                  label: "Card Primary Text"
                }),
                PropertyPaneTextField('primarydesc', {
                  label: "Card Description"
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
