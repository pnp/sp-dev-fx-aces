import { IPropertyPaneConfiguration, IPropertyPaneDropdownOption, PropertyPaneDropdown, PropertyPaneSlider, PropertyPaneTextField, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import * as strings from 'OneDriveFullImageCarouselAdaptiveCardExtensionStrings';

export class OneDriveFullImageCarouselPropertyPane {
  public getPropertyPaneConfiguration(drivesResults: IPropertyPaneDropdownOption[]): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
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
                PropertyPaneToggle("fullBleed", {
                  label: strings.FullBleedLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
