import { IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import * as strings from 'FrequentlyAskedQuestionsAdaptiveCardExtensionStrings';
import { IFrequentlyAskedQuestionsAdaptiveCardExtensionProps } from './FrequentlyAskedQuestionsAdaptiveCardExtension';
import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';

export class FrequentlyAskedQuestionsPropertyPane {
  public getPropertyPaneConfiguration(
    properties: IFrequentlyAskedQuestionsAdaptiveCardExtensionProps,
    context: AdaptiveCardExtensionContext,
    onPropertyPaneFieldChanged: () => void
  ): IPropertyPaneConfiguration {
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
                PropertyPaneTextField('mainImage', {
                  label: "Image to show on the card"
                }),
                PropertyFieldCollectionData("faqs", {
                  key: "faqs",
                  label: "FAQs",
                  panelHeader: "",
                  manageBtnLabel: "Manage FAQs",
                  value: properties.faqs,
                  fields: [
                    {
                      id: "question",
                      title: "Question",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "answer",
                      title: "Answer",
                      type: CustomCollectionFieldType.string
                    }
                  ],
                  disabled: false
                }),
                PropertyPaneToggle('allowMultipleExpanded', {
                  label: "Allow multiple expanded items"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
