var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
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
import { HttpClient } from '@microsoft/sp-http';
import WordOfTheDaySampleData from './model/WordOfTheDaySample';
var CARD_VIEW_REGISTRY_ID = 'WordOfTheDay_CARD_VIEW';
export var QUICK_VIEW_REGISTRY_ID = 'WordOfTheDay_QUICK_VIEW';
var WORDNIK_API_URL = "https://api.wordnik.com/v4/words.json/";
var WORD_OF_THE_DAY = "wordOfTheDay";
var API_KEY = "api_key";
var WordOfTheDayAdaptiveCardExtension = /** @class */ (function (_super) {
    __extends(WordOfTheDayAdaptiveCardExtension, _super);
    function WordOfTheDayAdaptiveCardExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WordOfTheDayAdaptiveCardExtension.prototype.onInit = function () {
        var _this = this;
        this.state = {
            wordOfTheDay: undefined,
            isError: false
        };
        this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, function () { return new CardView(); });
        this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, function () { return new QuickView(); });
        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadWordOfTheDay()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, 500);
        return Promise.resolve();
    };
    WordOfTheDayAdaptiveCardExtension.prototype.loadWordOfTheDay = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, wordOfTheDay;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if ((this.properties.useSampleData == undefined || this.properties.useSampleData == false) && (this.properties.apiKey == undefined || this.properties.apiKey.length == 0)) {
                            this.setState({
                                wordOfTheDay: undefined,
                                isError: true
                            });
                            return [2 /*return*/];
                        }
                        if (!((this.properties.useSampleData == undefined || this.properties.useSampleData == false) && (this.properties.apiKey && this.properties.apiKey.length > 0))) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.context.httpClient.get("" + WORDNIK_API_URL + WORD_OF_THE_DAY + "?" + API_KEY + "=" + this.properties.apiKey, HttpClient.configurations.v1)];
                    case 1:
                        response = _a.sent();
                        wordOfTheDay = undefined;
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        wordOfTheDay = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!wordOfTheDay) {
                            this.setState({
                                wordOfTheDay: undefined,
                                isError: true
                            });
                            return [2 /*return*/];
                        }
                        this.setState({
                            wordOfTheDay: wordOfTheDay
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        if (this.properties.useSampleData == true) {
                            this.setState({
                                wordOfTheDay: WordOfTheDaySampleData.WordOfTheDaySample()
                            });
                        }
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(WordOfTheDayAdaptiveCardExtension.prototype, "title", {
        get: function () {
            return this.properties.title;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WordOfTheDayAdaptiveCardExtension.prototype, "iconProperty", {
        get: function () {
            return 'PlainText';
        },
        enumerable: false,
        configurable: true
    });
    WordOfTheDayAdaptiveCardExtension.prototype.loadPropertyPaneResources = function () {
        var _this = this;
        return import(
        /* webpackChunkName: 'WordOfTheDay-property-pane'*/
        './WordOfTheDayPropertyPane')
            .then(function (component) {
            _this._deferredPropertyPane = new component.WordOfTheDayPropertyPane();
        });
    };
    WordOfTheDayAdaptiveCardExtension.prototype.onPropertyPaneFieldChanged = function (propertyPath, oldValue, newValue) {
        if (oldValue == newValue) {
            return;
        }
        if (propertyPath == "useSampleData" || propertyPath == "apiKey") {
            this.loadWordOfTheDay();
        }
    };
    WordOfTheDayAdaptiveCardExtension.prototype.renderCard = function () {
        return CARD_VIEW_REGISTRY_ID;
    };
    WordOfTheDayAdaptiveCardExtension.prototype.getPropertyPaneConfiguration = function () {
        return this._deferredPropertyPane.getPropertyPaneConfiguration();
    };
    return WordOfTheDayAdaptiveCardExtension;
}(BaseAdaptiveCardExtension));
export default WordOfTheDayAdaptiveCardExtension;
//# sourceMappingURL=WordOfTheDayAdaptiveCardExtension.js.map