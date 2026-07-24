"use strict";
(self["webpackJsonp_9de5431e-069e-4a2b-bd66-6dc732349d9f_1.1.0"] = self["webpackJsonp_9de5431e-069e-4a2b-bd66-6dc732349d9f_1.1.0"] || []).push([["ReactQuickView-property-pane"],{

/***/ 5151
/*!*********************************************************************************!*\
  !*** ./lib/adaptiveCardExtensions/reactQuickView/ReactQuickViewPropertyPane.js ***!
  \*********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReactQuickViewPropertyPane: () => (/* binding */ ReactQuickViewPropertyPane)
/* harmony export */ });
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/sp-property-pane */ 9877);
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ReactQuickViewAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ReactQuickViewAdaptiveCardExtensionStrings */ 6498);
/* harmony import */ var ReactQuickViewAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ReactQuickViewAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__);


var ReactQuickViewPropertyPane = /** @class */ (function () {
    function ReactQuickViewPropertyPane() {
    }
    ReactQuickViewPropertyPane.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: { description: ReactQuickViewAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__.PropertyPaneDescription },
                    groups: [
                        {
                            groupFields: [
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__.PropertyPaneTextField)('title', {
                                    label: ReactQuickViewAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__.TitleFieldLabel
                                }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__.PropertyPaneTextField)('listName', {
                                    label: ReactQuickViewAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__.ListNameFieldLabel
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



/***/ }

}]);
//# sourceMappingURL=chunk.ReactQuickView-property-pane.js.map