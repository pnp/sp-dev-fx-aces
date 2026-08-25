"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var sp_adaptive_card_extension_base_1 = require("@microsoft/sp-adaptive-card-extension-base");
var CardView_1 = require("./cardView/CardView");
var CARD_VIEW_REGISTRY_ID = 'StockBitcoinFeed_CARD_VIEW';
var StockBitcoinFeedAdaptiveCardExtension = /** @class */ (function (_super) {
    tslib_1.__extends(StockBitcoinFeedAdaptiveCardExtension, _super);
    function StockBitcoinFeedAdaptiveCardExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StockBitcoinFeedAdaptiveCardExtension.prototype.onInit = function () {
        var _this = this;
        if (!!this.properties.finnhubtoken && !!this.properties.finnhubsymbol) {
            var socket_1 = new WebSocket("wss://ws.finnhub.io?token=".concat(this.properties.finnhubtoken));
            socket_1.addEventListener('open', function () {
                socket_1.send(JSON.stringify({ 'type': 'subscribe', 'symbol': _this.properties.finnhubsymbol }));
            });
            socket_1.addEventListener('message', function (event) {
                console.log(event.data);
                var response = JSON.parse(event.data);
                switch (response.type) {
                    case 'trade':
                        _this.setState({ lastPrice: response.data[0].p });
                        break;
                    case 'ping':
                        console.log('occasional server connect');
                        break;
                    default:
                        console.log(response);
                        break;
                }
            });
        }
        this.state = { lastPrice: 0.0 };
        this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, function () { return new CardView_1.CardView(); });
        return Promise.resolve();
    };
    StockBitcoinFeedAdaptiveCardExtension.prototype.loadPropertyPaneResources = function () {
        var _this = this;
        return Promise.resolve().then(function () { return tslib_1.__importStar(require(
        /* webpackChunkName: 'StockBitcoinFeed-property-pane'*/
        './StockBitcoinFeedPropertyPane')); }).then(function (component) {
            _this._deferredPropertyPane = new component.StockBitcoinFeedPropertyPane();
        });
    };
    StockBitcoinFeedAdaptiveCardExtension.prototype.renderCard = function () {
        return CARD_VIEW_REGISTRY_ID;
    };
    StockBitcoinFeedAdaptiveCardExtension.prototype.getPropertyPaneConfiguration = function () {
        var _a;
        return (_a = this._deferredPropertyPane) === null || _a === void 0 ? void 0 : _a.getPropertyPaneConfiguration();
    };
    return StockBitcoinFeedAdaptiveCardExtension;
}(sp_adaptive_card_extension_base_1.BaseAdaptiveCardExtension));
exports.default = StockBitcoinFeedAdaptiveCardExtension;
//# sourceMappingURL=StockBitcoinFeedAdaptiveCardExtension.js.map