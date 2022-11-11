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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { GraphClientProvider } from "graph-client-library";
var CARD_VIEW_REGISTRY_ID = 'TrendingDocuments_CARD_VIEW';
export var QUICK_VIEW_REGISTRY_ID = 'TrendingDocuments_QUICK_VIEW';
var TrendingDocumentsAdaptiveCardExtension = /** @class */ (function (_super) {
    __extends(TrendingDocumentsAdaptiveCardExtension, _super);
    function TrendingDocumentsAdaptiveCardExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TrendingDocumentsAdaptiveCardExtension.prototype.onInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var graphClientProvider, client, trendingDocsResponse, trendingDocs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.state = {};
                        this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, function () { return new CardView(); });
                        this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, function () { return new QuickView(); });
                        graphClientProvider = this.context.serviceScope.consume(GraphClientProvider.serviceKey);
                        return [4 /*yield*/, graphClientProvider.getGraphClient()];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, client.get("https://graph.microsoft.com/v1.0/me/insights/trending")];
                    case 2:
                        trendingDocsResponse = _a.sent();
                        return [4 /*yield*/, trendingDocsResponse.json()];
                    case 3:
                        trendingDocs = _a.sent();
                        console.log(trendingDocs);
                        return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    TrendingDocumentsAdaptiveCardExtension.prototype.loadPropertyPaneResources = function () {
        var _this = this;
        return import(
        /* webpackChunkName: 'TrendingDocuments-property-pane'*/
        './TrendingDocumentsPropertyPane')
            .then(function (component) {
            _this._deferredPropertyPane = new component.TrendingDocumentsPropertyPane();
        });
    };
    TrendingDocumentsAdaptiveCardExtension.prototype.renderCard = function () {
        return CARD_VIEW_REGISTRY_ID;
    };
    TrendingDocumentsAdaptiveCardExtension.prototype.getPropertyPaneConfiguration = function () {
        return this._deferredPropertyPane.getPropertyPaneConfiguration();
    };
    return TrendingDocumentsAdaptiveCardExtension;
}(BaseAdaptiveCardExtension));
export default TrendingDocumentsAdaptiveCardExtension;
//# sourceMappingURL=TrendingDocumentsAdaptiveCardExtension.js.map