import { IPropertyPaneConfiguration, IPropertyPaneField, IPropertyPaneGroup, PropertyPaneChoiceGroup, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'MostLikedPagesAdaptiveCardExtensionStrings';
import { PropertyFieldSitePicker } from '@pnp/spfx-property-controls/lib/PropertyFieldSitePicker';
import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
import { IMostLikedPagesAdaptiveCardExtensionProps } from './MostLikedPagesAdaptiveCardExtension';

export class MostLikedPagesPropertyPane {

  private context: any = undefined;
  private sourceState: string;
  private _group: IPropertyPaneGroup;
  private properties: IMostLikedPagesAdaptiveCardExtensionProps;
  private onPropertyPaneFieldChanged: (propertyPath: string, oldValue: any, newValue: any) => Promise<void>;

  constructor(
    context: AdaptiveCardExtensionContext,
    properties: IMostLikedPagesAdaptiveCardExtensionProps,
    onPropertyPaneFieldChanged: (propertyPath: string, oldValue: any, newValue: any) => Promise<void>,
  ) {
    this.context = context;
    this.properties = properties;
    this.onPropertyPaneFieldChanged = onPropertyPaneFieldChanged;
  }

  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    this.getConditionalGroup();
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
                PropertyPaneChoiceGroup('selectedSource',
                  {
                    label: "Pages source",
                    options: [
                      { text: "This site", key: "currentSite", checked: true },
                      { text: "Select sites", key: "selected" }
                    ]
                  })
              ]
            },
            this._group
          ]
        }
      ]
    };
  }
  private getConditionalGroup = async () => {
    const groupFields: Array<IPropertyPaneField<any>> = new Array<IPropertyPaneField<any>>();
    this._group = {
      groupName: "",
      groupFields: groupFields,
      isCollapsed: false,
      isGroupNameHidden: true
    }

    if (this.properties.selectedSource === "selected" || this.properties.selectedSource === undefined) {
      groupFields.push(PropertyFieldSitePicker('selectedSites', {
        label: 'Select sites',
        initialSites: this.properties.selectedSites,
        context: this.context,
        deferredValidationTime: 500,
        multiSelect: true,
        properties: this.properties,
        onPropertyChange: this.onPropertyPaneFieldChanged,
        key: "sitesSelectedId"
      }));
    } else {
      this.properties.selectedSites = [];
    }
    if (this.sourceState !== this.properties.selectedSource) {
      this.sourceState = this.properties.selectedSource;
      this.context.propertyPane.refresh();
    }
  }

}
