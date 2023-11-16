import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { IPropertyPaneButtonProps, IPropertyPaneConfiguration, IPropertyPaneField, IPropertyPaneLabelProps, PropertyPaneButton, PropertyPaneButtonType, PropertyPaneLabel, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'BasicCardHelpDeskAdaptiveCardExtensionStrings';
import { helpDeskService } from '../services/helpdesk.service';
import { HelpDeskLibraryFields, ListNames } from '../models/helpdesk.models';

export class BasicCardHelpDeskPropertyPane {
  private LOG_SOURCE = "🔶 Help Desk Property Pane";
  
  constructor(
    public listExists: boolean = false,
    public context: AdaptiveCardExtensionContext) {
  }
  
  public async createList(context: AdaptiveCardExtensionContext): Promise<void> {
    this.listExists = await helpDeskService.createList(ListNames.HELPDESKLIST, strings.LibraryDesc, HelpDeskLibraryFields);
    if (this.listExists) {
      context.propertyPane.refresh();
    }
  }
  
  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

    const ppConfig: IPropertyPaneConfiguration = {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.GroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneTextField('bingMapsKey', {
                  label: strings.BingMapsAPIKeyLabel,
                  description: strings.BingMapsAPIKeyDescription
                }),
                PropertyPaneTextField('iconProperty', {
                  label: strings.IconPropertyFieldLabel
                })
              ]
            }
          ],
        },
      ],
    };
    try {
      const addListButtonLabel: IPropertyPaneField<IPropertyPaneLabelProps> = PropertyPaneLabel("", {
        text: strings.AddLibraryLabel
      });
      const addListButtonDesc: IPropertyPaneField<IPropertyPaneLabelProps> = PropertyPaneLabel("", {
        text: strings.AddLibraryDesc
      });
      const group: any = ppConfig.pages[0].groups[0];
      const groupFields: IPropertyPaneField<any>[] = group.groupFields;
      groupFields.push(addListButtonLabel);
      if (!this.listExists) {
        const addListButton: IPropertyPaneField<IPropertyPaneButtonProps> = PropertyPaneButton("library", {
          text: strings.AddLibraryButton,
          ariaLabel: strings.AddLibraryButton,
          ariaDescription: strings.AddLibraryDesc,
          buttonType: PropertyPaneButtonType.Primary,
          description: strings.AddLibraryDesc,
          onClick: () => this.createList(this.context)
        });
        groupFields.push(addListButton);
        groupFields.push(addListButtonDesc);
      } else {
        const libraryAddedDesc: IPropertyPaneField<IPropertyPaneLabelProps> = PropertyPaneLabel("", {
          text: strings.LibraryAddedDesc
        });
        groupFields.push(libraryAddedDesc);
        groupFields.push(addListButtonDesc);
      }

    } catch (err) {
      console.error(
        `${this.LOG_SOURCE} (getPropertyPaneConfiguration) - ${err}`
      );
    }
    return ppConfig;
  }
}
