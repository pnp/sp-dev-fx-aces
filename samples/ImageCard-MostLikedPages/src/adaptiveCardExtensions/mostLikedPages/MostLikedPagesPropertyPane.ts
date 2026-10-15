import { IPropertyPaneConfiguration, IPropertyPaneField, PropertyPaneCheckbox, PropertyPaneChoiceGroup, PropertyPaneLabel, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'MostLikedPagesAdaptiveCardExtensionStrings';
import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
import { IMostLikedPagesAdaptiveCardExtensionProps } from './MostLikedPagesAdaptiveCardExtension';
import { IPropertyFieldSite } from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";
import { SITE_TOGGLE_PREFIX } from '../types';

export class MostLikedPagesPropertyPane {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private context: any = undefined;
  private properties: IMostLikedPagesAdaptiveCardExtensionProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onPropertyPaneFieldChanged: (propertyPath: string, oldValue: any, newValue: any) => Promise<void>;
  private availableSites: IPropertyFieldSite[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _groupFields: IPropertyPaneField<any>[] = [];

  constructor(
    context: AdaptiveCardExtensionContext,
    properties: IMostLikedPagesAdaptiveCardExtensionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onPropertyPaneFieldChanged: (propertyPath: string, oldValue: any, newValue: any) => Promise<void>,
    availableSites: IPropertyFieldSite[],
  ) {
    this.context = context;
    this.properties = properties;
    this.onPropertyPaneFieldChanged = onPropertyPaneFieldChanged;
    this.availableSites = availableSites ?? [];
  }

  public getSiteByToggleIndex(index: number): IPropertyFieldSite | undefined {
    return this.availableSites[index];
  }

  private _buildGroupFields = (): void => {
    this._groupFields = [
      PropertyPaneTextField('title', {
        label: strings.TitleFieldLabel
      }),
      PropertyPaneChoiceGroup('selectedSource', {
        label: "Pages source",
        options: [
          { text: "This site", key: "currentSite" },
          { text: "Select sites", key: "selected" }
        ]
      })
    ];

    if (this.properties.selectedSource === "selected") {
      this._groupFields.push(PropertyPaneLabel('sitesLabel', { text: 'Select sites' }));
      this.availableSites.forEach((site, index) => {
        const isChecked: boolean = this.properties.selectedSites.some(s => s.id === site.id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.properties as any)[`${SITE_TOGGLE_PREFIX}${index}`] = isChecked;
        this._groupFields.push(PropertyPaneCheckbox(`${SITE_TOGGLE_PREFIX}${index}`, {
          text: site.title,
          checked: isChecked
        }));
      });
    } else {
      this.properties.selectedSites = [];
    }
  }

  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    this._buildGroupFields();
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupFields: this._groupFields
            }
          ]
        }
      ]
    };
  }

}
