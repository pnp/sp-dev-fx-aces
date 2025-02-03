var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { Logger, ConsoleListener } from "@pnp/logging";
var CARD_VIEW_REGISTRY_ID = 'FaqSearch_CARD_VIEW';
export var QUICK_VIEW_REGISTRY_ID = 'FaqSearch_QUICK_VIEW';
var FaqSearchAdaptiveCardExtension = /** @class */ (function (_super) {
    __extends(FaqSearchAdaptiveCardExtension, _super);
    function FaqSearchAdaptiveCardExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FaqSearchAdaptiveCardExtension.prototype.onInit = function () {
        // Initialize faqCollectionData if it's not already set
        if (!this.properties.faqCollectionData) {
            this.properties.faqCollectionData = [];
        }
        Logger.subscribe(new ConsoleListener()); // Logs output to the console
        Logger.activeLogLevel = 1 /* LogLevel.Info */; // Set the default log level (Info, Verbose, Warning, Error)
        // Register card and quick views
        this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, function () { return new CardView(); });
        this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, function () { return new QuickView(); });
        return Promise.resolve();
    };
    FaqSearchAdaptiveCardExtension.prototype.loadPropertyPaneResources = function () {
        var _this = this;
        return import(
        /* webpackChunkName: 'FaqSearch-property-pane'*/
        './FaqSearchPropertyPane')
            .then(function (component) {
            _this._deferredPropertyPane = new component.FaqSearchPropertyPane(_this.properties);
        });
    };
    FaqSearchAdaptiveCardExtension.prototype.renderCard = function () {
        return CARD_VIEW_REGISTRY_ID;
    };
    FaqSearchAdaptiveCardExtension.prototype.getPropertyPaneConfiguration = function () {
        var _a;
        return (_a = this._deferredPropertyPane) === null || _a === void 0 ? void 0 : _a.getPropertyPaneConfiguration();
    };
    return FaqSearchAdaptiveCardExtension;
}(BaseAdaptiveCardExtension));
export default FaqSearchAdaptiveCardExtension;
//# sourceMappingURL=FaqSearchAdaptiveCardExtension.js.map