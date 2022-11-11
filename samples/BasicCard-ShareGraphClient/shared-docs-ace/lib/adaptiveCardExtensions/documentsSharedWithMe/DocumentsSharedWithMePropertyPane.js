import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'DocumentsSharedWithMeAdaptiveCardExtensionStrings';
var DocumentsSharedWithMePropertyPane = /** @class */ (function () {
    function DocumentsSharedWithMePropertyPane() {
    }
    DocumentsSharedWithMePropertyPane.prototype.getPropertyPaneConfiguration = function () {
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
    return DocumentsSharedWithMePropertyPane;
}());
export { DocumentsSharedWithMePropertyPane };
//# sourceMappingURL=DocumentsSharedWithMePropertyPane.js.map