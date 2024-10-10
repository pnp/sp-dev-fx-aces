import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import * as strings from 'OfficelocatorAdaptiveCardExtensionStrings';
import { IOfficelocatorAdaptiveCardExtensionProps } from './OfficelocatorAdaptiveCardExtension';
import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';

export class OfficelocatorPropertyPane {
  public getPropertyPaneConfiguration(
    properties: IOfficelocatorAdaptiveCardExtensionProps,
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
                PropertyPaneTextField('mapkey', {
                  label: strings.AzureMapKeyLabel
                }),
                PropertyFieldCollectionData("offices", {
                  key: "offices",
                  label: "Office Locations",
                  panelHeader: "",
                  manageBtnLabel: "Manage Office Locations",
                  value: properties.offices,
                  fields: [
                    {
                      id: "title",
                      title: "Title",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "address",
                      title: "Address",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "phone",
                      title: "Phone",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "lon",
                      title: "Longitude",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "lat",
                      title: "Latitude",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },                   
                    {
                      id: "image",
                      title: "Image URL",
                      type: CustomCollectionFieldType.string,
                      required: true
                    }
                  ],
                  disabled: false
                })               
              ]
            }
          ]
        }
      ]
    };
  }
}
