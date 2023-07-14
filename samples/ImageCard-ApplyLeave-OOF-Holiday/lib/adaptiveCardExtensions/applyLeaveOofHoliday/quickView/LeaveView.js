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
import { BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { sp } from '@pnp/sp/presets/all';
import commonAction from '../../../services/CommonService';
import { GraphService } from '../../../services/GraphService';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { SUCCESS_VIEW_REGISTRY_ID } from '../ApplyLeaveOofHolidayAdaptiveCardExtension';
var LeaveView = /** @class */ (function (_super) {
    __extends(LeaveView, _super);
    function LeaveView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(LeaveView.prototype, "data", {
        get: function () {
            return {
                endDate: this.state.leaveInfo.endDate,
                startDate: this.state.leaveInfo.startDate,
                isOOFEnabled: this.state.leaveInfo.isOOfEnabled,
                leaveType: this.state.leaveInfo.leaveType,
                leaveDesc: this.state.leaveInfo.leaveDescription,
                oofMessage: this.state.leaveInfo.oofMessage,
                uploadIcon: require("../assets/uploadIcon.png"),
                errOnSubmit: this.state.errOnSubmit
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LeaveView.prototype, "template", {
        get: function () {
            return require('./template/LeaveViewTemplate.json');
        },
        enumerable: false,
        configurable: true
    });
    LeaveView.prototype.onAction = function (action) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, startDate_1, endDate_1, isOOfEnabled, authorInfo, err_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        debugger;
                        this._graphService = new GraphService(this.context);
                        if (!(action.type == "Submit")) return [3 /*break*/, 2];
                        _a = this.state.leaveInfo, startDate_1 = _a.startDate, endDate_1 = _a.endDate, isOOfEnabled = _a.isOOfEnabled;
                        return [4 /*yield*/, sp.web.currentUser.get()];
                    case 1:
                        authorInfo = _b.sent();
                        if (!isOOfEnabled) {
                            debugger;
                            commonAction.addItemToList(this.state.leaveInfo, authorInfo)
                                .then(function (res) {
                                _this.quickViewNavigator.push(SUCCESS_VIEW_REGISTRY_ID, false);
                                //!isEmpty(res)? window.location.reload():null;
                            });
                        }
                        else {
                            commonAction.addItemToList(this.state.leaveInfo, authorInfo)
                                .then(function (res) {
                                debugger;
                                if (action.data.oofMessage !== undefined && !isEmpty(res)) {
                                    _this._graphService.SetOutOfOffice(startDate_1, endDate_1, action.data.oofMessage)
                                        .then(function (oofResponse) {
                                        debugger;
                                        console.log(oofResponse);
                                        _this.quickViewNavigator.push(SUCCESS_VIEW_REGISTRY_ID, false);
                                        if (oofResponse)
                                            return window.location.reload();
                                        _this.setState({
                                            errOnSubmit: true
                                        });
                                        //this.quickViewNavigator.push(LEAVE_VIEW_REGISTRY_ID,false);
                                    });
                                }
                                else {
                                    var OOF_MESSAGE = "Out of office";
                                    _this._graphService.SetOutOfOffice(startDate_1, endDate_1, OOF_MESSAGE)
                                        .then(function (oofResponse) {
                                        if (oofResponse)
                                            return window.location.reload();
                                        // this.setState({
                                        //     errOnSubmit:true
                                        // });
                                        // this.quickViewNavigator.push(LEAVE_VIEW_REGISTRY_ID,false);
                                    });
                                }
                            });
                        }
                        _b.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        console.log("Exception :", err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return LeaveView;
}(BaseAdaptiveCardView));
export { LeaveView };
//# sourceMappingURL=LeaveView.js.map