"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AceMyLocationPropertyPane = void 0;
const sp_property_pane_1 = require("@microsoft/sp-property-pane");
const strings = require("AceMyLocationAdaptiveCardExtensionStrings");
class AceMyLocationPropertyPane {
    getPropertyPaneConfiguration() {
        return {
            pages: [
                {
                    header: { description: strings.PropertyPaneDescription },
                    groups: [
                        {
                            groupFields: [
                                (0, sp_property_pane_1.PropertyPaneTextField)('title', {
                                    label: strings.TitleFieldLabel
                                }),
                                (0, sp_property_pane_1.PropertyPaneTextField)('listGUID', {
                                    label: "List GUID"
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    }
}
exports.AceMyLocationPropertyPane = AceMyLocationPropertyPane;
//# sourceMappingURL=AceMyLocationPropertyPane.js.map