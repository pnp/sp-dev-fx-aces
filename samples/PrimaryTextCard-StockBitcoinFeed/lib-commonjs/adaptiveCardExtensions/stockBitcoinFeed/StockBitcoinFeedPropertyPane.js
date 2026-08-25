"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockBitcoinFeedPropertyPane = void 0;
var tslib_1 = require("tslib");
var sp_property_pane_1 = require("@microsoft/sp-property-pane");
var strings = tslib_1.__importStar(require("StockBitcoinFeedAdaptiveCardExtensionStrings"));
var StockBitcoinFeedPropertyPane = /** @class */ (function () {
    function StockBitcoinFeedPropertyPane() {
    }
    StockBitcoinFeedPropertyPane.prototype.getPropertyPaneConfiguration = function () {
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
                                (0, sp_property_pane_1.PropertyPaneTextField)('description', {
                                    label: strings.DescriptionFieldLabel
                                }),
                                (0, sp_property_pane_1.PropertyPaneTextField)('finnhubtoken', {
                                    label: strings.Finnhubtoken
                                }),
                                (0, sp_property_pane_1.PropertyPaneTextField)('finnhubsymbol', {
                                    label: strings.Finnhubsymbol
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return StockBitcoinFeedPropertyPane;
}());
exports.StockBitcoinFeedPropertyPane = StockBitcoinFeedPropertyPane;
//# sourceMappingURL=StockBitcoinFeedPropertyPane.js.map