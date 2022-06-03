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
import { formatDistanceToNow } from 'date-fns';
import utilities from '../utils/utils';
var Services = /** @class */ (function () {
    function Services(context) {
        var _this = this;
        this._context = undefined;
        this._msGraphClient = undefined;
        this.init = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this._context.msGraphClientFactory.getClient()];
                    case 1:
                        _a._msGraphClient = _b.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.getSiteInfo = function (siteId) { return __awaiter(_this, void 0, void 0, function () {
            var siteResults, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!this._msGraphClient || siteId)
                            return [2 /*return*/];
                        return [4 /*yield*/, this._msGraphClient
                                .api("/sites/" + siteId)
                                .select("displayName")
                                .get()];
                    case 1:
                        siteResults = _a.sent();
                        return [2 /*return*/, siteResults];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getDriveInfo = function (driveId) { return __awaiter(_this, void 0, void 0, function () {
            var driveResults, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!this._msGraphClient || !driveId)
                            return [2 /*return*/];
                        return [4 /*yield*/, this._msGraphClient
                                .api("/drives/" + driveId)
                                .select("name")
                                .get()];
                    case 1:
                        driveResults = _a.sent();
                        return [2 /*return*/, driveResults];
                    case 2:
                        error_2 = _a.sent();
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getRecentFiles = function () { return __awaiter(_this, void 0, void 0, function () {
            var siteResults, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!this._msGraphClient)
                            return [2 /*return*/];
                        return [4 /*yield*/, this._msGraphClient.api("/me/drive/recent").top(15).get()];
                    case 1:
                        siteResults = _a.sent();
                        return [2 /*return*/, siteResults.value];
                    case 2:
                        error_3 = _a.sent();
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getFiles = function () { return __awaiter(_this, void 0, void 0, function () {
            var files, listOfFiles, _i, files_1, file, fileIcon, isOnDrive, fileLocation, siteInfo, driveInfo, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 11, , 12]);
                        return [4 /*yield*/, this.getRecentFiles()];
                    case 1:
                        files = _a.sent();
                        listOfFiles = [];
                        _i = 0, files_1 = files;
                        _a.label = 2;
                    case 2:
                        if (!(_i < files_1.length)) return [3 /*break*/, 10];
                        file = files_1[_i];
                        return [4 /*yield*/, utilities.GetFileImageUrl(file.name)];
                    case 3:
                        fileIcon = _a.sent();
                        return [4 /*yield*/, utilities.isOndrive(file.webUrl)];
                    case 4:
                        isOnDrive = _a.sent();
                        fileLocation = "";
                        if (!isOnDrive) return [3 /*break*/, 5];
                        fileLocation = "OnDrive > " + this._context.pageContext.user.displayName;
                        return [3 /*break*/, 8];
                    case 5: return [4 /*yield*/, this.getSiteInfo(file.remoteItem.sharepointIds.siteId)];
                    case 6:
                        siteInfo = _a.sent();
                        return [4 /*yield*/, this.getDriveInfo(file.remoteItem.parentReference.driveId)];
                    case 7:
                        driveInfo = _a.sent();
                        fileLocation = (siteInfo === null || siteInfo === void 0 ? void 0 : siteInfo.displayName) + " > " + (driveInfo === null || driveInfo === void 0 ? void 0 : driveInfo.name);
                        _a.label = 8;
                    case 8:
                        listOfFiles.push(__assign(__assign({}, file), { fileLocation: fileLocation, name: utilities.getShortName(file.name), fileIcon: fileIcon, lastModifiedDateString: formatDistanceToNow(new Date(file.lastModifiedDateTime), { addSuffix: true }) }));
                        _a.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 2];
                    case 10: return [2 /*return*/, listOfFiles];
                    case 11:
                        error_4 = _a.sent();
                        throw error_4;
                    case 12: return [2 /*return*/];
                }
            });
        }); };
        this._context = context;
    }
    return Services;
}());
export { Services };
//# sourceMappingURL=services.js.map