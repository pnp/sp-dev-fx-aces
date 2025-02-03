import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'ReactQuickViewAdaptiveCardExtensionStrings';
var ReactQuickViewPropertyPane = /** @class */ (function () {
    function ReactQuickViewPropertyPane() {
    }
    ReactQuickViewPropertyPane.prototype.getPropertyPaneConfiguration = function () {
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
                                PropertyPaneTextField('listName', {
                                    label: strings.ListNameFieldLabel
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return ReactQuickViewPropertyPane;
}());
export { ReactQuickViewPropertyPane };
//# sourceMappingURL=ReactQuickViewPropertyPane.js.map