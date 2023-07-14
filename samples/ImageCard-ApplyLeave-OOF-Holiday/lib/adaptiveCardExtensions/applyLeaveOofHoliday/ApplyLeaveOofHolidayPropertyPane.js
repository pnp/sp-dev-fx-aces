import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'ApplyLeaveOofHolidayAdaptiveCardExtensionStrings';
var ApplyLeaveOofHolidayPropertyPane = /** @class */ (function () {
    function ApplyLeaveOofHolidayPropertyPane() {
    }
    ApplyLeaveOofHolidayPropertyPane.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: { description: strings.PropertyPaneDescription },
                    groups: [
                        {
                            groupFields: [
                                PropertyPaneTextField('title', {
                                    label: strings.TitleFieldLabel
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return ApplyLeaveOofHolidayPropertyPane;
}());
export { ApplyLeaveOofHolidayPropertyPane };
//# sourceMappingURL=ApplyLeaveOofHolidayPropertyPane.js.map