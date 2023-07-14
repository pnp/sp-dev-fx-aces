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
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { HttpClient } from '@microsoft/sp-http';
import moment from 'moment';
import { Constants } from './Constants';
import { sp } from '@pnp/sp/presets/all';
var HOLIDAY_API_URL = "https://calendarific.com/api/v2/holidays?api_key=eb7a99eaf99303ed521768a508e3caebadb33457&country={0}&year=2023";
var CommonService = /** @class */ (function () {
    function CommonService() {
        var _this = this;
        this.getHolidayList = function (context, countryCode) { return __awaiter(_this, void 0, void 0, function () {
            var response, data, holidayList, nextHoliday_1, holidayCalArr_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, context.httpClient.get(HOLIDAY_API_URL.replace('{0}', countryCode), HttpClient.configurations.v1)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        holidayList = data.response;
                        if (!isEmpty(holidayList)) {
                            holidayCalArr_1 = [];
                            holidayList.holidays.map(function (dateElement) {
                                var diff = moment(dateElement.date.iso).diff(moment(), 'days');
                                if (diff > 0) {
                                    if (nextHoliday_1) {
                                        if (moment(dateElement).diff(moment(nextHoliday_1), 'days') < 0) {
                                            nextHoliday_1 = dateElement;
                                        }
                                        holidayCalArr_1.push(dateElement);
                                    }
                                    else {
                                        nextHoliday_1 = dateElement;
                                    }
                                }
                            });
                            console.log(holidayCalArr_1);
                            return [2 /*return*/, { nextHoliday: nextHoliday_1, holidayCalArr: holidayCalArr_1 }];
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        this.getConfigList = function (emailId) { return __awaiter(_this, void 0, void 0, function () {
            var configItem, configRes, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, sp.web.lists.getByTitle(Constants.CONFIG_LIST_NAME).items
                                .filter("Title eq '".concat(Constants.CONFIG_KEY, "' and Email eq '").concat(emailId, "'"))
                                .get()];
                    case 1:
                        configItem = _a.sent();
                        configRes = !isEmpty(configItem) ? configItem : null;
                        return [2 /*return*/, configRes];
                    case 2:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.addItemToList = function (leaveInfo, authorInfo) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, sp.web.lists.getByTitle(Constants.LEAVETRACKER_LIST_NAME).items.add({
                        Title: leaveInfo.leaveType,
                        StartDate: leaveInfo.startDate,
                        EndDate: leaveInfo.endDate,
                        LeaveType: leaveInfo.leaveType,
                        LeaveDescription: leaveInfo.leaveDescription,
                        AppliedById: authorInfo.Id
                    })];
            });
        }); };
    }
    return CommonService;
}());
var commonAction = new CommonService();
export default commonAction;
//# sourceMappingURL=CommonService.js.map