"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUICK_VIEW_REGISTRY_ID = void 0;
var tslib_1 = require("tslib");
var sp_adaptive_card_extension_base_1 = require("@microsoft/sp-adaptive-card-extension-base");
var CardView_1 = require("./cardView/CardView");
var QuickView_1 = require("./quickView/QuickView");
var CARD_VIEW_REGISTRY_ID = 'ReactQuickView_CARD_VIEW';
exports.QUICK_VIEW_REGISTRY_ID = 'ReactQuickView_QUICK_VIEW';
var ReactQuickViewAdaptiveCardExtension = /** @class */ (function (_super) {
    tslib_1.__extends(ReactQuickViewAdaptiveCardExtension, _super);
    function ReactQuickViewAdaptiveCardExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReactQuickViewAdaptiveCardExtension.prototype.onInit = function () {
        this.state = {};
        // registers the card view to be shown in a dashboard
        this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, function () { return new CardView_1.CardView(); });
        // registers the quick view to open via QuickView action
        this.quickViewNavigator.register(exports.QUICK_VIEW_REGISTRY_ID, function () { return new QuickView_1.QuickView(); });
        return Promise.resolve();
    };
    ReactQuickViewAdaptiveCardExtension.prototype.loadPropertyPaneResources = function () {
        var _this = this;
        return Promise.resolve().then(function () { return tslib_1.__importStar(require(
        /* webpackChunkName: 'ReactQuickView-property-pane'*/
        './ReactQuickViewPropertyPane')); }).then(function (component) {
            _this._deferredPropertyPane = new component.ReactQuickViewPropertyPane();
        });
    };
    ReactQuickViewAdaptiveCardExtension.prototype.renderCard = function () {
        return CARD_VIEW_REGISTRY_ID;
    };
    ReactQuickViewAdaptiveCardExtension.prototype.getPropertyPaneConfiguration = function () {
        var _a;
        return (_a = this._deferredPropertyPane) === null || _a === void 0 ? void 0 : _a.getPropertyPaneConfiguration();
    };
    return ReactQuickViewAdaptiveCardExtension;
}(sp_adaptive_card_extension_base_1.BaseAdaptiveCardExtension));
exports.default = ReactQuickViewAdaptiveCardExtension;
//# sourceMappingURL=ReactQuickViewAdaptiveCardExtension.js.map