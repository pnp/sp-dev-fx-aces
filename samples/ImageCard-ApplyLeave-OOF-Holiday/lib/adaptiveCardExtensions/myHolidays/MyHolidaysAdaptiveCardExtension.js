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
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { sp } from '@pnp/sp/presets/all';
import commonAction from '../../services/CommonService';
import { isEmpty } from '@microsoft/sp-lodash-subset';
var CARD_VIEW_REGISTRY_ID = 'MyHolidays_CARD_VIEW';
export var QUICK_VIEW_REGISTRY_ID = 'MyHolidays_QUICK_VIEW';
export var DETAILED_QUICK_VIEW_REGISTRY_ID = 'MyHolidays_DETAILED_VIEW';
var MyHolidaysAdaptiveCardExtension = /** @class */ (function (_super) {
    __extends(MyHolidaysAdaptiveCardExtension, _super);
    function MyHolidaysAdaptiveCardExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyHolidaysAdaptiveCardExtension.prototype.onInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var aceContext, countryCode, myLeaveCalendar, myHolidays, upcomingHoliday, configItem, isTrueSet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        aceContext = this.context;
                        sp.setup({
                            spfxContext: aceContext
                        });
                        this.state = {
                            myHolidays: null,
                            upcomingHoliday: null,
                            currentIndex: 0
                        };
                        this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, function () { return new CardView(); });
                        this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, function () { return new QuickView(); });
                        countryCode = !isEmpty(this.properties.dropdownProperty) ? this.properties.dropdownProperty : 'in';
                        return [4 /*yield*/, commonAction.getHolidayList(this.context, countryCode)];
                    case 1:
                        myLeaveCalendar = _a.sent();
                        if (!isEmpty(myLeaveCalendar) && myLeaveCalendar.holidayCalArr != undefined && myLeaveCalendar.nextHoliday != undefined) {
                            myHolidays = myLeaveCalendar.holidayCalArr;
                            myHolidays = myHolidays.map(function (ele) { return (__assign(__assign({}, ele), { img: require("./assets/Holi.png") })); });
                            upcomingHoliday = myLeaveCalendar.nextHoliday;
                        }
                        else {
                            myHolidays = null;
                            upcomingHoliday = null;
                        }
                        return [4 /*yield*/, commonAction.getConfigList(this.context.pageContext.user.email)];
                    case 2:
                        configItem = _a.sent();
                        isTrueSet = false;
                        if (configItem != null && configItem.length > 0) {
                            isTrueSet = configItem[0].Value === 'true';
                        }
                        this.isVisible = (isTrueSet !== undefined && isTrueSet !== null) ? isTrueSet : false;
                        this.setState({
                            myHolidays: myHolidays,
                            upcomingHoliday: upcomingHoliday
                        });
                        return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    MyHolidaysAdaptiveCardExtension.prototype.loadPropertyPaneResources = function () {
        var _this = this;
        return import(
        /* webpackChunkName: 'MyHolidays-property-pane'*/
        './MyHolidaysPropertyPane')
            .then(function (component) {
            _this._deferredPropertyPane = new component.MyHolidaysPropertyPane();
        });
    };
    MyHolidaysAdaptiveCardExtension.prototype.renderCard = function () {
        return CARD_VIEW_REGISTRY_ID;
    };
    MyHolidaysAdaptiveCardExtension.prototype.getPropertyPaneConfiguration = function () {
        var _a;
        return (_a = this._deferredPropertyPane) === null || _a === void 0 ? void 0 : _a.getPropertyPaneConfiguration();
    };
    Object.defineProperty(MyHolidaysAdaptiveCardExtension.prototype, "iconProperty", {
        get: function () {
            return require("./assets/holidayIcon.png");
        },
        enumerable: false,
        configurable: true
    });
    return MyHolidaysAdaptiveCardExtension;
}(BaseAdaptiveCardExtension));
export default MyHolidaysAdaptiveCardExtension;
//# sourceMappingURL=MyHolidaysAdaptiveCardExtension.js.map