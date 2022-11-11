import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'TrendingDocumentsAdaptiveCardExtensionStrings';
var TrendingDocumentsPropertyPane = /** @class */ (function () {
    function TrendingDocumentsPropertyPane() {
    }
    TrendingDocumentsPropertyPane.prototype.getPropertyPaneConfiguration = function () {
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
    return TrendingDocumentsPropertyPane;
}());
export { TrendingDocumentsPropertyPane };
//# sourceMappingURL=TrendingDocumentsPropertyPane.js.map