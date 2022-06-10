import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'MyRecentFilesAdaptiveCardExtensionStrings';
var MyRecentFilesPropertyPane = /** @class */ (function () {
    function MyRecentFilesPropertyPane() {
    }
    MyRecentFilesPropertyPane.prototype.getPropertyPaneConfiguration = function () {
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
    return MyRecentFilesPropertyPane;
}());
export { MyRecentFilesPropertyPane };
//# sourceMappingURL=MyRecentFilesPropertyPane.js.map