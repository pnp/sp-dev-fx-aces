(window["webpackJsonp_5a92c1f0_9ebd_4a00_8d82_e4ca1274657f_0_0_1"] = window["webpackJsonp_5a92c1f0_9ebd_4a00_8d82_e4ca1274657f_0_0_1"] || []).push([["StockBitcoinFeed-property-pane"],{

/***/ "oheA":
/*!*************************************************************************************!*\
  !*** ./lib/adaptiveCardExtensions/stockBitcoinFeed/StockBitcoinFeedPropertyPane.js ***!
  \*************************************************************************************/
/*! exports provided: StockBitcoinFeedPropertyPane */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StockBitcoinFeedPropertyPane", function() { return StockBitcoinFeedPropertyPane; });
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/sp-property-pane */ "26ea");
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var StockBitcoinFeedAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! StockBitcoinFeedAdaptiveCardExtensionStrings */ "p06y");
/* harmony import */ var StockBitcoinFeedAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(StockBitcoinFeedAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__);


var StockBitcoinFeedPropertyPane = /** @class */ (function () {
    function StockBitcoinFeedPropertyPane() {
    }
    StockBitcoinFeedPropertyPane.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: { description: StockBitcoinFeedAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["PropertyPaneDescription"] },
                    groups: [
                        {
                            groupFields: [
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneTextField"])('title', {
                                    label: StockBitcoinFeedAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["TitleFieldLabel"]
                                }),
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneTextField"])('description', {
                                    label: StockBitcoinFeedAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["DescriptionFieldLabel"]
                                }),
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneTextField"])('finnhubtoken', {
                                    label: StockBitcoinFeedAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["Finnhubtoken"]
                                }),
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneTextField"])('finnhubsymbol', {
                                    label: StockBitcoinFeedAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["Finnhubsymbol"]
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



/***/ })

}]);
//# sourceMappingURL=chunk.StockBitcoinFeed-property-pane.js.map