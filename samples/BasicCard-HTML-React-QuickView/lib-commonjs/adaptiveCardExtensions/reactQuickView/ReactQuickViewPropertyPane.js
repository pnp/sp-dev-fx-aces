"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactQuickViewPropertyPane = void 0;
var tslib_1 = require("tslib");
var sp_property_pane_1 = require("@microsoft/sp-property-pane");
var strings = tslib_1.__importStar(require("ReactQuickViewAdaptiveCardExtensionStrings"));
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
                                (0, sp_property_pane_1.PropertyPaneTextField)('title', {
                                    label: strings.TitleFieldLabel
                                }),
                                (0, sp_property_pane_1.PropertyPaneTextField)('listName', {
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
exports.ReactQuickViewPropertyPane = ReactQuickViewPropertyPane;
//# sourceMappingURL=ReactQuickViewPropertyPane.js.map