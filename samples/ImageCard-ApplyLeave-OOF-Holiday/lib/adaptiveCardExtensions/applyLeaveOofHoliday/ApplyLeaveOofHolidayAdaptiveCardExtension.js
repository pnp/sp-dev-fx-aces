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
import commonAction from '../../services/CommonService';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp/presets/all';
import { Constants } from '../../services/Constants';
var CARD_VIEW_REGISTRY_ID = 'ApplyLeave_CARD_VIEW';
export var QUICK_VIEW_REGISTRY_ID = 'ApplyLeave_QUICK_VIEW';
export var LEAVE_VIEW_REGISTRY_ID = 'ApplyLeave_LEAVE_VIEW';
export var HOLIDAY_CONFIG_VIEW_REGISTRY_ID = 'ApplyLeave_HolidayConfig_VIEW';
export var LEAVE_HISTORY_CONFIG_VIEW_REGISTRY_ID = 'Leave_History_Config_VIEW';
export var SUCCESS_VIEW_REGISTRY_ID = 'Success_QUICK_VIEW';
var ApplyLeaveOofHolidayAdaptiveCardExtension = /** @class */ (function (_super) {
    __extends(ApplyLeaveOofHolidayAdaptiveCardExtension, _super);
    function ApplyLeaveOofHolidayAdaptiveCardExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getMyLeaves = function () { return __awaiter(_this, void 0, void 0, function () {
            var userLeaves, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, sp.web.lists.getByTitle(Constants.LEAVETRACKER_LIST_NAME).items
                                .orderBy("Created", true)
                                .select("StartDate", "EndDate", "LeaveType", "LeaveDescription", "AppliedBy/Title", "AppliedBy/ID", "AppliedBy/EMail", "Created", "Status")
                                .expand("AppliedBy")
                                .filter("AppliedBy/EMail eq '".concat(this.context.pageContext.user.email, "'"))
                                //.filter(`AppliedBy/EMail eq '${this.context.pageContext.user.email}' and StartDate ge '${today.toISOString()}'`)    
                                .get()];
                    case 1:
                        userLeaves = _a.sent();
                        return [2 /*return*/, userLeaves];
                    case 2:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        return _this;
    }
    ApplyLeaveOofHolidayAdaptiveCardExtension.prototype.onInit = function () {
        var _this = this;
        var aceContext = this.context;
        sp.setup({
            spfxContext: aceContext
        });
        this.state = {
            leaveInfo: { endDate: null, isOOfEnabled: true, leaveDescription: null, leaveType: null, oofMessage: "out of office", startDate: null, attachment: null },
            startDateIsGreater: false,
            errOnSubmit: false,
            appliedLeaves: null,
            myHoliday: null,
            nearestHoliday: null,
            isHCardEnabled: false,
            leaveHistory: [{ endDate: null, isOOfEnabled: true, leaveDescription: null, leaveType: null, oofMessage: "out of office", startDate: null, attachment: null }],
        };
        this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, function () { return new CardView(); });
        this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, function () { return import('./quickView/QuickView')
            .then(function (component) { return new component.QuickView(); }); });
        this.quickViewNavigator.register(LEAVE_VIEW_REGISTRY_ID, function () { return import('./quickView/LeaveView')
            .then(function (component) { return new component.LeaveView(); }); });
        this.quickViewNavigator.register(HOLIDAY_CONFIG_VIEW_REGISTRY_ID, function () { return import('./quickView/HolidayConfigView')
            .then(function (component) { return new component.HolidayConfigView(); }); });
        this.quickViewNavigator.register(LEAVE_HISTORY_CONFIG_VIEW_REGISTRY_ID, function () { return import('./quickView/LHistoryView')
            .then(function (component) { return new component.LHistoryView(); }); });
        this.quickViewNavigator.register(SUCCESS_VIEW_REGISTRY_ID, function () { return import('./quickView/SuccessView')
            .then(function (component) { return new component.SuccessView(); }); });
        var today = new Date();
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var userAppliedLeaves, appliedLeaves_1, leaveHistory_1, configItem, isTrueSet, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        debugger;
                        return [4 /*yield*/, this.getMyLeaves()];
                    case 1:
                        userAppliedLeaves = _a.sent();
                        appliedLeaves_1 = [];
                        leaveHistory_1 = [];
                        //recent applied leaves
                        userAppliedLeaves.filter(function (ele) {
                            if (new Date(ele.StartDate) > today) {
                                appliedLeaves_1.push(ele);
                            }
                            else {
                                leaveHistory_1.push(ele);
                            }
                        });
                        return [4 /*yield*/, commonAction.getConfigList(this.context.pageContext.user.email)];
                    case 2:
                        configItem = _a.sent();
                        isTrueSet = (configItem[0].Value !== undefined && configItem[0].Value !== null && configItem[0].Value != '' && configItem[0].Value === 'true');
                        appliedLeaves_1 = !isEmpty(appliedLeaves_1) ? { startDate: appliedLeaves_1[0].StartDate, endDate: appliedLeaves_1[0].EndDate, leaveDescription: appliedLeaves_1[0].LeaveDescription, leaveType: appliedLeaves_1[0].LeaveType } : null;
                        this.setState({
                            appliedLeaves: appliedLeaves_1,
                            isHCardEnabled: isTrueSet,
                            leaveHistory: leaveHistory_1
                        });
                        resolve(null);
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        resolve(null);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    ApplyLeaveOofHolidayAdaptiveCardExtension.prototype.loadPropertyPaneResources = function () {
        var _this = this;
        return import(
        /* webpackChunkName: 'ApplyLeaveOofHoliday-property-pane'*/
        './ApplyLeaveOofHolidayPropertyPane')
            .then(function (component) {
            _this._deferredPropertyPane = new component.ApplyLeaveOofHolidayPropertyPane();
        });
    };
    ApplyLeaveOofHolidayAdaptiveCardExtension.prototype.renderCard = function () {
        return CARD_VIEW_REGISTRY_ID;
    };
    ApplyLeaveOofHolidayAdaptiveCardExtension.prototype.getPropertyPaneConfiguration = function () {
        var _a;
        return (_a = this._deferredPropertyPane) === null || _a === void 0 ? void 0 : _a.getPropertyPaneConfiguration();
    };
    Object.defineProperty(ApplyLeaveOofHolidayAdaptiveCardExtension.prototype, "iconProperty", {
        get: function () {
            return require("./assets/oofIcon.png");
        },
        enumerable: false,
        configurable: true
    });
    return ApplyLeaveOofHolidayAdaptiveCardExtension;
}(BaseAdaptiveCardExtension));
export default ApplyLeaveOofHolidayAdaptiveCardExtension;
//# sourceMappingURL=ApplyLeaveOofHolidayAdaptiveCardExtension.js.map