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
var CARD_VIEW_REGISTRY_ID = 'StockBitcoinFeed_CARD_VIEW';
var StockBitcoinFeedAdaptiveCardExtension = /** @class */ (function (_super) {
    __extends(StockBitcoinFeedAdaptiveCardExtension, _super);
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
        this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, function () { return new CardView(); });
        return Promise.resolve();
    };
    StockBitcoinFeedAdaptiveCardExtension.prototype.loadPropertyPaneResources = function () {
        var _this = this;
        return import(
        /* webpackChunkName: 'StockBitcoinFeed-property-pane'*/
        './StockBitcoinFeedPropertyPane')
            .then(function (component) {
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
}(BaseAdaptiveCardExtension));
export default StockBitcoinFeedAdaptiveCardExtension;
//# sourceMappingURL=StockBitcoinFeedAdaptiveCardExtension.js.map