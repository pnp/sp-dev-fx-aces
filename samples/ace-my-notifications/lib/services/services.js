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
import { MSGraphClientFactory } from "@microsoft/sp-http";
import { io } from "socket.io-client";
export var EListType;
(function (EListType) {
    EListType["file"] = "file";
    EListType["listItem"] = "listItem";
})(EListType || (EListType = {}));
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
        this.getSiteInfoByRelativeUrl = function (url) { return __awaiter(_this, void 0, void 0, function () {
            var hostName, siteResults, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hostName = location.hostname;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        if (!this._msGraphClient)
                            return [2 /*return*/];
                        return [4 /*yield*/, this._msGraphClient
                                .api("/sites/" + hostName + ":/" + url)
                                .select("sharepointIds, id, webUrl,displayName,parentReference")
                                .get()];
                    case 2:
                        siteResults = _a.sent();
                        return [2 /*return*/, siteResults];
                    case 3:
                        error_1 = _a.sent();
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.getListActivities = function (siteId, listId) { return __awaiter(_this, void 0, void 0, function () {
            var listsActivitiesResults, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!this._msGraphClient)
                            return [2 /*return*/];
                        return [4 /*yield*/, this._msGraphClient
                                .api("/sites/" + siteId + "/lists/" + listId + "/activities")
                                .expand("listItem($expand=fields),driveItem")
                                .top(1)
                                .version("beta")
                                .get()];
                    case 1:
                        listsActivitiesResults = (_a.sent());
                        return [2 /*return*/, listsActivitiesResults.value];
                    case 2:
                        error_2 = _a.sent();
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getListInfo = function (siteId, listId) { return __awaiter(_this, void 0, void 0, function () {
            var siteResults, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!this._msGraphClient)
                            return [2 /*return*/];
                        return [4 /*yield*/, this._msGraphClient.api("/sites/" + siteId + "/lists/" + listId).get()];
                    case 1:
                        siteResults = _a.sent();
                        return [2 /*return*/, siteResults];
                    case 2:
                        error_3 = _a.sent();
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getListItem = function (siteId, listId, activity) { return __awaiter(_this, void 0, void 0, function () {
            var graphUrl, itemId, listItemResults, type, _a, driveId, error_4, error_5, lItemResults;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this._msGraphClient)
                            return [2 /*return*/];
                        graphUrl = "";
                        itemId = "";
                        type = (activity === null || activity === void 0 ? void 0 : activity.driveItem) ? "file" : (activity === null || activity === void 0 ? void 0 : activity.listItem) ? "listItem" : undefined;
                        _a = type;
                        switch (_a) {
                            case EListType.file: return [3 /*break*/, 1];
                            case EListType.listItem: return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 7];
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        driveId = activity.driveItem.parentReference.driveId;
                        itemId = activity.driveItem.parentReference.id;
                        graphUrl = "/sites/" + siteId + "/drives/" + driveId + "/items/" + itemId;
                        return [4 /*yield*/, this._msGraphClient.api(graphUrl).get()];
                    case 2:
                        listItemResults = (_b.sent());
                        return [2 /*return*/, { itemInfo: listItemResults, type: type }];
                    case 3:
                        error_4 = _b.sent();
                        return [2 /*return*/, { itemInfo: undefined, type: type }];
                    case 4:
                        _b.trys.push([4, 6, , 7]);
                        itemId = activity.listItem.id;
                        graphUrl = "/sites/" + siteId + "/lists/" + listId + "/items/" + itemId;
                        return [4 /*yield*/, this._msGraphClient.api(graphUrl).get()];
                    case 5:
                        listItemResults = (_b.sent());
                        return [2 /*return*/, { itemInfo: listItemResults, type: type }];
                    case 6:
                        error_5 = _b.sent();
                        return [2 /*return*/, { itemInfo: undefined, type: type }];
                    case 7:
                        graphUrl = "/sites/" + siteId + "/lists/" + listId;
                        return [4 /*yield*/, this._msGraphClient.api(graphUrl).get()];
                    case 8:
                        lItemResults = (_b.sent());
                        type = lItemResults.list.template === "documentLibrary" ? "file" : "listItem";
                        return [2 /*return*/, { itemInfo: undefined, type: type }];
                }
            });
        }); };
        this.getLists = function (searchString) { return __awaiter(_this, void 0, void 0, function () {
            var searchRequest, graphUrl, listsResults;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchRequest = {
                            requests: [
                                {
                                    entityTypes: ["list"],
                                    query: { queryString: searchString + "*" },
                                    sortProperties: [{ name: "name", isDescending: "false" }],
                                },
                            ],
                        };
                        graphUrl = "/search/query";
                        return [4 /*yield*/, this._msGraphClient.api(graphUrl + " ").version("beta").post(searchRequest)];
                    case 1:
                        listsResults = _a.sent();
                        return [2 /*return*/, listsResults.value[0].hitsContainers[0]];
                }
            });
        }); };
        this.getListSockectIo = function (siteId, listId) { return __awaiter(_this, void 0, void 0, function () {
            var _a, listSubscription, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, this._context.serviceScope.consume(MSGraphClientFactory.serviceKey).getClient()];
                    case 1:
                        _a._msGraphClient = _b.sent();
                        if (!this._msGraphClient)
                            return [2 /*return*/];
                        return [4 /*yield*/, this._msGraphClient
                                .api("/sites/" + siteId + "/lists/" + listId + "/subscriptions/socketIo")
                                .get()];
                    case 2:
                        listSubscription = (_b.sent());
                        return [2 /*return*/, listSubscription];
                    case 3:
                        error_6 = _b.sent();
                        throw error_6;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.connectToSocketListServer = function (notificationUrl, handleNotifications) {
            var split = notificationUrl.split("/callback?");
            var socket = io(split[0], { query: split[1], transports: ["websocket"] });
            socket.on("connect", function () {
                console.log("Connected!", notificationUrl);
            });
            socket.on("notification", handleNotifications);
            socket.on("disconnect", function (reason) {
                console.log("disconnect", reason);
            });
            socket.on("connect_error", function (reason) {
                console.log("error", reason);
            });
            return socket;
        };
        this._context = context;
    }
    return Services;
}());
export { Services };
//# sourceMappingURL=services.js.map