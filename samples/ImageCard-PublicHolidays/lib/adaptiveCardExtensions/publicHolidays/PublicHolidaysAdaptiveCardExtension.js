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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { LoadingView } from './loadingView/LoadingView';
import { SuccessView } from './successView/SuccessView';
import { ErrorView } from './errorView/ErrorView';
import PublicHolidaysService from '../../services/PublicHolidaysService';
import { ErrorCardView } from './cardView/ErrorCardView';
import { SetupCardView } from './cardView/SetupCardView';
var CARD_VIEW_REGISTRY_ID = 'PublicHolidays_CARD_VIEW';
var ERROR_CARD_VIEW_REGISTRY_ID = 'PublicHolidays_ERROR_CARD_VIEW';
var CARD_VIEW_SETUP_ID = 'PublicHolidays_Setup_CARD_VIEW';
export var QUICK_VIEW_REGISTRY_ID = 'PublicHolidays_QUICK_VIEW';
export var LOADING_VIEW_REGISTRY_ID = 'PublicHolidays_LOADING_VIEW';
export var SUCCESS_VIEW_REGISTRY_ID = 'PublicHolidays_SUCCESS_VIEW';
export var ERROR_VIEW_REGISTRY_ID = 'PublicHolidays_ERROR_VIEW';
var PublicHolidaysAdaptiveCardExtension = /** @class */ (function (_super) {
    __extends(PublicHolidaysAdaptiveCardExtension, _super);
    function PublicHolidaysAdaptiveCardExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PublicHolidaysAdaptiveCardExtension.prototype.onInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.state = {
                            upcomingHolidays: [],
                            officeLocation: "",
                            isLocationUpdated: false,
                            areHolidaysLoaded: false,
                            userProfileProperty: this.properties.userProfileProperty,
                            limitToDate: this.properties.limitToDate,
                            listGUID: this.properties.listTitle,
                            availableLocations: { listTitle: "", items: [] },
                            listURL: this.context.pageContext.site.absoluteUrl + "/Lists/"
                        };
                        this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, function () { return new CardView(); });
                        this.cardNavigator.register(ERROR_CARD_VIEW_REGISTRY_ID, function () { return new ErrorCardView(); });
                        this.cardNavigator.register(CARD_VIEW_SETUP_ID, function () { return new SetupCardView(); });
                        this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, function () { return new QuickView(); });
                        this.quickViewNavigator.register(LOADING_VIEW_REGISTRY_ID, function () { return new LoadingView(); });
                        this.quickViewNavigator.register(ERROR_VIEW_REGISTRY_ID, function () { return new ErrorView(); });
                        this.quickViewNavigator.register(SUCCESS_VIEW_REGISTRY_ID, function () { return new SuccessView(); });
                        PublicHolidaysService.setup(this.context);
                        return [4 /*yield*/, this._loadCardInfo(this.properties.listTitle, this.properties.userProfileProperty, this.properties.limitToDate)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    PublicHolidaysAdaptiveCardExtension.prototype._loadCardInfo = function (listGUID, userProfileProperty, limitToDate) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                    var currentLocation;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (isEmpty(this.properties.listTitle)) {
                                    this.cardNavigator.replace(CARD_VIEW_SETUP_ID);
                                    return [2 /*return*/];
                                }
                                return [4 /*yield*/, PublicHolidaysService.getOfficeLocation(userProfileProperty)];
                            case 1:
                                currentLocation = _a.sent();
                                PublicHolidaysService.getAvailableLocations(listGUID).then(function (availableLocations) {
                                    var listURLWithFilter = "".concat(_this.state.listURL).concat(availableLocations.listTitle, "/AllItems.aspx?FilterField1=OfficeLocation&FilterValue1=").concat(currentLocation);
                                    _this.setState({
                                        availableLocations: availableLocations,
                                        listURL: listURLWithFilter
                                    });
                                })
                                    .catch(function (error) {
                                    _this.cardNavigator.replace(ERROR_CARD_VIEW_REGISTRY_ID);
                                    return;
                                });
                                PublicHolidaysService.getUpcomingPublicHolidays(listGUID, limitToDate, currentLocation, 1)
                                    .then(function (holidays) {
                                    _this.setState(__assign(__assign({}, _this.state), { userProfileProperty: userProfileProperty, upcomingHolidays: holidays, officeLocation: currentLocation, isLocationUpdated: false, areHolidaysLoaded: false, limitToDate: limitToDate, listGUID: listGUID }));
                                    _this.cardNavigator.replace(CARD_VIEW_REGISTRY_ID);
                                    return Promise.resolve();
                                })
                                    .catch(function (error) {
                                    _this.cardNavigator.replace(ERROR_CARD_VIEW_REGISTRY_ID);
                                    _this.setState(__assign(__assign({}, _this.state), { upcomingHolidays: [] }));
                                    return;
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    PublicHolidaysAdaptiveCardExtension.prototype.loadPropertyPaneResources = function () {
        var _this = this;
        return import(
        /* webpackChunkName: 'PublicHolidays-property-pane'*/
        './PublicHolidaysPropertyPane')
            .then(function (component) {
            _this._deferredPropertyPane = new component.PublicHolidaysPropertyPane();
        });
    };
    PublicHolidaysAdaptiveCardExtension.prototype.renderCard = function () {
        return CARD_VIEW_REGISTRY_ID;
    };
    PublicHolidaysAdaptiveCardExtension.prototype.getPropertyPaneConfiguration = function () {
        return this._deferredPropertyPane.getPropertyPaneConfiguration(this.properties, this.context, this.onPropertyPaneFieldChanged.bind(this));
    };
    PublicHolidaysAdaptiveCardExtension.prototype.onPropertyPaneFieldChanged = function (propertyPath, oldValue, newValue) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(newValue !== oldValue)) return [3 /*break*/, 6];
                        if (!(propertyPath === "limitToDate")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._loadCardInfo(this.properties.listTitle, this.properties.userProfileProperty, newValue)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 2:
                        if (!(propertyPath === "listTitle")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._loadCardInfo(newValue, this.properties.userProfileProperty, this.properties.limitToDate)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        if (!(propertyPath === "userProfileProperty")) return [3 /*break*/, 6];
                        return [4 /*yield*/, this._loadCardInfo(this.properties.listTitle, newValue, this.properties.limitToDate)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return PublicHolidaysAdaptiveCardExtension;
}(BaseAdaptiveCardExtension));
export default PublicHolidaysAdaptiveCardExtension;
//# sourceMappingURL=PublicHolidaysAdaptiveCardExtension.js.map