/* eslint-disable */
import { IPropertyPaneConfiguration, PropertyPaneChoiceGroup, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'GenericNewItemAdaptiveCardExtensionStrings';
import { IGenericNewItemAdaptiveCardExtensionProps } from './GenericNewItemAdaptiveCardExtension';

export class GenericNewItemPropertyPane {
  public getPropertyPaneConfiguration(properties: IGenericNewItemAdaptiveCardExtensionProps, context: any,
    onPropertyPaneFieldChanged: () => void): IPropertyPaneConfiguration {

      let submitButton: any = [];
      let submitAction: any = [];
  
      if (properties.bodyOrFooter === "Body") {
        submitButton = PropertyPaneTextField('buttonLabel', {
          label: "Button label",
          placeholder: "Enter label of the submit button."
        });
      }
      else {
        submitAction = PropertyPaneTextField('iconName', {
          label: "Submit action icon",
          placeholder: "Enter action icon"
        });
      }

    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.PropertyPaneCardViewGroupLabel,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneTextField('subTitle', {
                  label: strings.SubTitle,
                }),
                PropertyPaneTextField('listTitle', {
                  label: strings.ListTitleFieldLabel,
                  placeholder: strings.ListTitlePlaceholder
                }),
                PropertyPaneChoiceGroup('bodyOrFooter', {
                  label: "Body or footer input",
                  options: [
                    {
                      key: 'Body',
                      text: 'Body',
                      checked: true
                    },
                    {
                      key: 'Footer',
                      text: 'Footer',
                    }
                  ]
                }),
                submitButton,
                submitAction
              ]
            },
            {
              groupName: strings.PropertyPaneSuccessErrorGroupLabel,
              groupFields: [
                PropertyPaneTextField('successTxt', {
                  label: strings.PropertyPaneFieldSuccessTxtLabel,
                  placeholder: strings.SuccessMessagePlaceholder
                }),
                PropertyPaneTextField('errorTxt', {
                  label: strings.PropertyPaneFieldErrorTxtLabel,
                  placeholder: strings.ErrorMessagePlaceholder
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
