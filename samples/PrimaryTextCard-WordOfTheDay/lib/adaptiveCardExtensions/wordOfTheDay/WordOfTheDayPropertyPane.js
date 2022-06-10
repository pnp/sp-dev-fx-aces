import { PropertyPaneTextField, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import * as strings from 'WordOfTheDayAdaptiveCardExtensionStrings';
var WordOfTheDayPropertyPane = /** @class */ (function () {
    function WordOfTheDayPropertyPane() {
    }
    WordOfTheDayPropertyPane.prototype.getPropertyPaneConfiguration = function () {
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
                                PropertyPaneTextField('apiKey', {
                                    label: strings.ApiKeyFieldLabel,
                                }),
                                PropertyPaneToggle('useSampleData', {
                                    label: strings.UseSampleDataFieldLabel
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return WordOfTheDayPropertyPane;
}());
export { WordOfTheDayPropertyPane };
//# sourceMappingURL=WordOfTheDayPropertyPane.js.map