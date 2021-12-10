import {
  IPropertyPaneConfiguration,
  IPropertyPaneField,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import * as strings from "AceMyNotificationsAdaptiveCardExtensionStrings";
import {
  PropertyFieldListPicker,
  PropertyFieldListPickerOrderBy,
} from "@pnp/spfx-property-controls/lib/PropertyFieldListPicker";
import { IAceMyNotificationsAdaptiveCardExtensionProps } from "./AceMyNotificationsAdaptiveCardExtension";
import { PropertyFieldSitePicker } from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";
import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
export class AceMyNotificationsPropertyPane {
  private _groupsfields: IPropertyPaneField<any>[] = [];
  private context = undefined;

  private onPropertyPaneFieldChanged: (propertyPath: string, oldValue: any, newValue: any) => Promise<void>;
  private properties: IAceMyNotificationsAdaptiveCardExtensionProps;

  constructor(
    context: AdaptiveCardExtensionContext,
    properties: IAceMyNotificationsAdaptiveCardExtensionProps,
    onPropertyPaneFieldChanged: (propertyPath: string, oldValue: any, newValue: any) => Promise<void>
  ) {
    this.context = context;
    this.properties = properties;
    this.context = context;
    this.onPropertyPaneFieldChanged = onPropertyPaneFieldChanged;
    console.log(properties);
  }

  private _getGroupFields = async () => {
    this._groupsfields = [
      PropertyPaneTextField("title", {
        label: strings.TitleFieldLabel,
      }),
      PropertyPaneTextField("iconProperty", {
        label: strings.IconPropertyFieldLabel,
      }),

      PropertyFieldSitePicker("selectedSite", {
        label: "Select sites",
        initialSites: this.properties.selectedSite,
        context: this.context,
        deferredValidationTime: 500,
        multiSelect: false,
        onPropertyChange: this.onPropertyPaneFieldChanged,
        properties: this.properties,
        key: "sitesFieldId",
      }),
    ];

    if (this.properties?.selectedSite?.length) {
      this._groupsfields.push(
        PropertyFieldListPicker("selectedList", {
          label: "Select a list",
          selectedList: this.properties.selectedList,
          includeHidden: false,
          webAbsoluteUrl: this.properties.selectedSite[0]?.url,
          orderBy: PropertyFieldListPickerOrderBy.Title,
          disabled: false,
          onPropertyChange: this.onPropertyPaneFieldChanged,
          properties: this.properties,
          context: this.context,
          onGetErrorMessage: null,
          deferredValidationTime: 0,
          key: "listPickerFieldId",
          includeListTitleAndUrl: true,
        })
      );
    }
  }

  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    this._getGroupFields();
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: this._groupsfields,
            },
          ],
        },
      ],
    };
  }
}
