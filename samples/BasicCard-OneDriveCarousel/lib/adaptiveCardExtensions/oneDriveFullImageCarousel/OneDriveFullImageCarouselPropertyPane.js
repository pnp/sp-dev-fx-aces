import { PropertyPaneDropdown, PropertyPaneSlider, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import * as strings from 'OneDriveFullImageCarouselAdaptiveCardExtensionStrings';
var OneDriveFullImageCarouselPropertyPane = /** @class */ (function () {
    function OneDriveFullImageCarouselPropertyPane() {
    }
    OneDriveFullImageCarouselPropertyPane.prototype.getPropertyPaneConfiguration = function (drivesResults) {
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
    };
    return OneDriveFullImageCarouselPropertyPane;
}());
export { OneDriveFullImageCarouselPropertyPane };
//# sourceMappingURL=OneDriveFullImageCarouselPropertyPane.js.map