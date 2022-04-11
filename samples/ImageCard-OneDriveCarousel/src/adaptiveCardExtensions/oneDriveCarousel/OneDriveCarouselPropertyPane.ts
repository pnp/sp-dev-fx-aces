import { IPropertyPaneConfiguration, PropertyPaneTextField, IPropertyPaneDropdownOption, PropertyPaneDropdown, PropertyPaneSlider, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import * as strings from 'OneDriveCarouselAdaptiveCardExtensionStrings';

export class OneDriveCarouselPropertyPane {
  public getPropertyPaneConfiguration(drivesResults: IPropertyPaneDropdownOption[]): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneTextField('iconProperty', {
                  label: strings.IconPropertyFieldLabel
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,
                  multiline: true
                }),
                PropertyPaneDropdown("selectedDriveId", {
                  label: strings.SelectedDriveIdDropdownLabel,
                  options: drivesResults,
                }),
                PropertyPaneSlider("timerMinutes", {
                  label: strings.TimerMinutesSliderLabel,
                  min: 1,
                  max: 60,
                  step: 1
                }),
                PropertyPaneToggle("randomizeImage", {
                  label: strings.RandomizeImageToggleLabel
                }),
                PropertyPaneToggle("hideButtons", {
                  label: strings.HideButtonsLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
