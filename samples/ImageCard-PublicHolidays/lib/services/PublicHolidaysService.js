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
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import { ImageHelper } from '@microsoft/sp-image-helper';
import * as moment from 'moment';
var PublicHolidaysService = /** @class */ (function () {
    function PublicHolidaysService() {
    }
    PublicHolidaysService.prototype.setup = function (context) {
        if (!this._sp && typeof context !== "undefined") {
            this._sp = spfi().using(SPFx(context));
            this.context = context;
        }
    };
    PublicHolidaysService.prototype.getOfficeLocation = function (userProfileProperty) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.context.msGraphClientFactory
                .getClient("3")
                .then(function (client) {
                client
                    .api("/me?$select=".concat(userProfileProperty))
                    .get(function (error, response, rawResponse) {
                    resolve(response[userProfileProperty]);
                })
                    .catch(function (error) {
                    reject(error);
                });
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    PublicHolidaysService.prototype.updateOfficeLocation = function (userProfileProperty, newLocation) {
        var _this = this;
        var userLocation = JSON.parse("{\"".concat(userProfileProperty, "\" : \"").concat(newLocation, "\"}"));
        return new Promise(function (resolve, reject) {
            _this.context.msGraphClientFactory
                .getClient("3")
                .then(function (client) {
                client
                    .api('/me')
                    .update(userLocation)
                    .catch(function (error) {
                    reject(error);
                });
            })
                .then(function () {
                resolve();
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    PublicHolidaysService.prototype.getUpcomingPublicHolidays = function (listGUID, limitToDate, currentLocation, rowCount) {
        return __awaiter(this, void 0, void 0, function () {
            var publicHolidays, currentDateISOFormat, rowLimitQuery, andQuery, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        publicHolidays = [];
                        currentDateISOFormat = new Date(Date.now()).toISOString();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        rowLimitQuery = rowCount ? "<RowLimit>".concat(rowCount, "</RowLimit>") : '';
                        andQuery = limitToDate ?
                            "<And>\n                    <And>\n                        <Geq>\n                            <FieldRef Name='Date' />\n                            <Value IncludeTimeValue='TRUE' Type='DateTime'>".concat(currentDateISOFormat, "</Value>\n                        </Geq>\n                        <Leq>\n                            <FieldRef Name='Date' />\n                            <Value IncludeTimeValue='TRUE' Type='DateTime'>").concat(new Date(limitToDate.displayValue).toISOString(), "</Value>\n                        </Leq>\n                    </And>\n                    <Contains>\n                        <FieldRef Name='OfficeLocation' /><Value Type='Choice'>").concat(currentLocation, "</Value>\n                    </Contains>\n                </And>")
                            :
                                "<And>\n                    <Geq>\n                        <FieldRef Name='Date' />\n                        <Value IncludeTimeValue='TRUE' Type='DateTime'>".concat(currentDateISOFormat, "</Value>\n                    </Geq>\n                    <Contains>\n                        <FieldRef Name='OfficeLocation' /><Value Type='Choice'>").concat(currentLocation, "</Value>\n                    </Contains>\n                </And>");
                        return [4 /*yield*/, this._sp.web.lists
                                .getById(listGUID)
                                .getItemsByCAMLQuery({
                                ViewXml: "<View>\n                                <Query>\n                                    <ViewFields>\n                                        <FieldRef Name=\"Title\" />\n                                        <FieldRef Name=\"OfficeLocation\" />\n                                        <FieldRef Name=\"Date\" />\n                                        <FieldRef Name=\"Image\" />\n                                    </ViewFields>\n                                    <Where>\n                                        ".concat(andQuery, "\n                                    </Where>\n                                    <OrderBy>\n                                        <FieldRef Name='Date' Ascending='True' />\n                                    </OrderBy>\n                                </Query>\n                                ").concat(rowLimitQuery, "\n                            </View>"),
                            })];
                    case 2:
                        publicHolidays = _a.sent();
                        publicHolidays.forEach(function (ph) {
                            ph.DateValue = moment(ph.Date).format("dddd, MMM D");
                            ph.ImageValue = ph.Image ?
                                ImageHelper.convertToImageUrl({
                                    sourceUrl: JSON.parse(ph.Image).serverRelativeUrl,
                                    width: 200
                                })
                                : require('../adaptiveCardExtensions/publicHolidays/assets/PublicHoliday.jpg');
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, Promise.reject(error_1)];
                    case 4: return [2 /*return*/, publicHolidays];
                }
            });
        });
    };
    PublicHolidaysService.prototype.getAvailableLocations = function (listGUID) {
        return __awaiter(this, void 0, void 0, function () {
            var availableLocations, officeLocationList, officeLocationListTitle, officeLocationField, officeLocationsFieldChoices, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        availableLocations = { listTitle: "", items: [] };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, this._sp.web.lists.getById(listGUID)];
                    case 2:
                        officeLocationList = _a.sent();
                        return [4 /*yield*/, officeLocationList.select("Title")()];
                    case 3:
                        officeLocationListTitle = _a.sent();
                        return [4 /*yield*/, this._sp.web.lists
                                .getById(listGUID).fields.getByTitle('OfficeLocation')()];
                    case 4:
                        officeLocationField = _a.sent();
                        return [4 /*yield*/, officeLocationField.Choices];
                    case 5:
                        officeLocationsFieldChoices = _a.sent();
                        officeLocationsFieldChoices.forEach(function (choice) {
                            var availableLocationItem = {
                                title: choice,
                                value: choice
                            };
                            availableLocations.items.push(availableLocationItem);
                        });
                        availableLocations.listTitle = officeLocationListTitle.Title;
                        return [2 /*return*/, Promise.resolve(availableLocations)];
                    case 6:
                        error_2 = _a.sent();
                        return [2 /*return*/, Promise.reject(error_2)];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return PublicHolidaysService;
}());
export { PublicHolidaysService };
var HolidayService = new PublicHolidaysService();
export default HolidayService;
//# sourceMappingURL=PublicHolidaysService.js.map