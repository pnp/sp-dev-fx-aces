import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import {
  CustomCollectionFieldType,
  PropertyFieldCollectionData,
} from "@pnp/spfx-property-controls";
import * as strings from "FaqSearchAdaptiveCardExtensionStrings";

export class FaqSearchPropertyPane {
  private properties: any;

  constructor(properties: any) {
    this.properties = properties;
  }

  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: "Card View Configuration",
              groupFields: [
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneTextField("heading", {
                  label: strings.PrimaryTextFieldLabel,
                }),
                PropertyPaneTextField("quickViewButton", {
                  label: strings.QuickViewButtonFieldLabel,
                }),
                PropertyPaneTextField("imageUrl", {
                  label: "Card Image Url",
                }),
              ],
            },
            {
              groupName: "FAQs Configuration",
              groupFields: [
                PropertyPaneTextField("siteUrl", {
                  label: "Site URL",
                }),
                PropertyPaneTextField("faqListName", {
                  label: "List Name for FAQs",
                }),
                PropertyPaneTextField("submitionListName", {
                  label: "List Name for User's Submissions",
                }),
                PropertyPaneTextField("faqFilterLabel", {
                  label: "Filter by Category Label",
                }),
                PropertyFieldCollectionData("faqCollectionData", {
                  key: "faqCollectionData", // Ensuring correct property key
                  label: "Configure FAQ Categories",
                  panelHeader: "Configure FAQ Categories",
                  manageBtnLabel: "Manage FAQ Categories",
                  value: this.properties.faqCollectionData, // Ensure correct property usage
                  fields: [
                    {
                      id: "Category",
                      title: "Category (Display Name)",
                      type: CustomCollectionFieldType.string,
                      required: true,
                    },
                    {
                      id: "Key",
                      title: "Key (Internal Name)",
                      type: CustomCollectionFieldType.string,
                    },
                    {
                      id: "Order",
                      title: "Order",
                      type: CustomCollectionFieldType.number,
                    },
                  ],
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
