import { PropertyPaneDropdown, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'MyHolidaysAdaptiveCardExtensionStrings';
var MyHolidaysPropertyPane = /** @class */ (function () {
    function MyHolidaysPropertyPane() {
    }
    MyHolidaysPropertyPane.prototype.getPropertyPaneConfiguration = function () {
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
                                PropertyPaneDropdown('dropdownProperty', {
                                    label: 'Country',
                                    options: [
                                        { key: 'in', text: 'India' },
                                        { key: 'us', text: 'USA' },
                                        { key: 'uk', text: 'UK' },
                                    ]
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return MyHolidaysPropertyPane;
}());
export { MyHolidaysPropertyPane };
//# sourceMappingURL=MyHolidaysPropertyPane.js.map