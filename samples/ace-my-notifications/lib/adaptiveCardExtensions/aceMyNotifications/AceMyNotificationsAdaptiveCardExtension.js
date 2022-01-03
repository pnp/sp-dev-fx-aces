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
import { BaseAdaptiveCardExtension } from "@microsoft/sp-adaptive-card-extension-base";
import { CardView } from "../../cards/cardView";
import { QuickView } from "../../cards/quickView";
import { isEmpty } from "lodash";
import { Services } from "../../services";
import { EActions } from "../../constants/EActions";
var services = undefined;
var selectedSiteId = "";
var selectedListId = "";
var _this;
var PROFILE_URL = "https://spteck.sharepoint.com/_layouts/15/userphoto.aspx?size=S&accountname=";
var CARD_VIEW_REGISTRY_ID = "AceMyNotifications_CARD_VIEW";
export var QUICK_VIEW_REGISTRY_ID = "AceMyNotifications_QUICK_VIEW";
var AceMyNotificationsAdaptiveCardExtension = /** @class */ (function (_super) {
    __extends(AceMyNotificationsAdaptiveCardExtension, _super);
    function AceMyNotificationsAdaptiveCardExtension() {
        var _this_1 = _super !== null && _super.apply(this, arguments) || this;
        _this_1.subscribeListNotifications = function () { return __awaiter(_this_1, void 0, void 0, function () {
            var subscription, notificationsUrl, sockitIOid, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, services.getListSockectIo(selectedSiteId, selectedListId)];
                    case 1:
                        subscription = _b.sent();
                        console.log(subscription);
                        if (!isEmpty(subscription)) {
                            // Disconnect previous sockect if active
                            if ((_a = this.state) === null || _a === void 0 ? void 0 : _a.socketIoId) {
                                this.state.socketIoId.removeAllListeners();
                            }
                            notificationsUrl = subscription.notificationUrl;
                            sockitIOid = services.connectToSocketListServer(notificationsUrl, this.handleNotifications);
                            this.setState({ socketIoId: sockitIOid });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        console.log(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this_1.onPropertyPaneFieldChanged = function (propertyPath, oldValue, newValue) { return __awaiter(_this_1, void 0, void 0, function () {
            var site;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _super.prototype.onPropertyPaneFieldChanged.call(this, propertyPath, oldValue, newValue);
                        if (propertyPath == "selectedSite" && newValue !== oldValue) {
                            site = newValue;
                            this.properties.selectedList = undefined;
                            selectedSiteId = (_b = (_a = site[0]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "";
                            this.context.propertyPane.refresh();
                        }
                        if (!(propertyPath == "selectedList" && newValue != oldValue)) return [3 /*break*/, 2];
                        selectedListId = newValue.id;
                        this.setState({ listNotifications: [] });
                        return [4 /*yield*/, this.subscribeListNotifications()];
                    case 1:
                        _c.sent();
                        this.context.propertyPane.refresh();
                        _c.label = 2;
                    case 2:
                        this.context.propertyPane.refresh();
                        this.renderCard();
                        return [2 /*return*/];
                }
            });
        }); };
        _this_1.getActionDescription = function (actionKey) {
            switch (actionKey) {
                case EActions.delete:
                    return "deleted";
                case EActions.create:
                    return "created";
                case EActions.comment:
                    return "commented";
                case EActions.copy:
                    return "copied";
                case EActions.edit:
                    return "edited";
                case EActions.mention:
                    return "mentioned";
                case EActions.mention:
                    return "mentioned";
                case EActions.move:
                    return "moved";
                case EActions.rename:
                    return "renamed";
                case EActions.restore:
                    return "restored";
                case EActions.share:
                    return "shared";
                case EActions.version:
                    return "versioned";
                default:
                    break;
            }
        };
        _this_1.addActivityToList = function (activity) { return __awaiter(_this_1, void 0, void 0, function () {
            var action, actor, newlistNotifications, _a, itemInfo, type, actionKey, listItem, _b, Title, id, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        console.log("Activities", activity);
                        action = activity.action, actor = activity.actor;
                        newlistNotifications = this.state.listNotifications;
                        return [4 /*yield*/, services.getListItem(selectedSiteId, selectedListId, activity)];
                    case 1:
                        _a = _c.sent(), itemInfo = _a.itemInfo, type = _a.type;
                        actionKey = Object.keys(action)[0];
                        console.log("del", action);
                        if (actionKey === EActions.delete) {
                            newlistNotifications.push({
                                author: {
                                    displayName: actor.user.displayName,
                                    email: actor.user.email,
                                    profilePhotoUrl: "" + PROFILE_URL + actor.user.email,
                                },
                                date: activity.times.recordedDateTime,
                                type: type,
                                url: "",
                                name: action.delete.name,
                                action: this.getActionDescription(actionKey),
                            });
                        }
                        if (type === "file" && actionKey != EActions.delete) {
                            newlistNotifications.push({
                                author: {
                                    displayName: actor.user.displayName,
                                    email: actor.user.email,
                                    profilePhotoUrl: "" + PROFILE_URL + actor.user.email,
                                },
                                date: activity.driveItem.createdDateTime,
                                type: type,
                                url: itemInfo.webUrl,
                                name: activity.driveItem.name,
                                action: this.getActionDescription(actionKey),
                            });
                        }
                        if (type === "listItem" && actionKey != EActions.delete) {
                            listItem = itemInfo;
                            _b = listItem.fields, Title = _b.Title, id = _b.id;
                            newlistNotifications.push({
                                author: {
                                    displayName: actor.user.displayName,
                                    email: actor.user.email,
                                    profilePhotoUrl: "" + PROFILE_URL + actor.user.email,
                                },
                                date: listItem.createdDateTime,
                                type: type,
                                url: listItem.webUrl.replace(id + "_.000", "dispForm.aspx?ID=" + id + " "),
                                name: Title,
                                action: this.getActionDescription(actionKey),
                            });
                        }
                        this.setState({ listNotifications: (newlistNotifications.reverse()) });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _c.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        return _this_1;
    }
    AceMyNotificationsAdaptiveCardExtension.prototype.onInit = function () {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _this = this;
                        services = new Services(this.context);
                        return [4 /*yield*/, services.init()];
                    case 1:
                        _d.sent();
                        this.state = {
                            listNotifications: [],
                            socketIoId: undefined,
                            fromCard: 1,
                        };
                        selectedListId = (_b = (_a = this.properties.selectedList) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "";
                        selectedSiteId = this.properties.selectedSite ? (_c = this.properties.selectedSite[0]) === null || _c === void 0 ? void 0 : _c.id : "";
                        if (!selectedListId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.subscribeListNotifications()];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, function () { return new CardView(); });
                        this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, function () { return new QuickView(); });
                        return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    Object.defineProperty(AceMyNotificationsAdaptiveCardExtension.prototype, "title", {
        get: function () {
            return this.properties.title;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AceMyNotificationsAdaptiveCardExtension.prototype, "iconProperty", {
        get: function () {
            return this.properties.iconProperty || require("../../assets/SharePointLogo.svg");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AceMyNotificationsAdaptiveCardExtension.prototype, "selectedList", {
        get: function () {
            return this.properties.selectedList;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AceMyNotificationsAdaptiveCardExtension.prototype, "selectedSite", {
        get: function () {
            return this.properties.selectedSite;
        },
        enumerable: false,
        configurable: true
    });
    AceMyNotificationsAdaptiveCardExtension.prototype.loadPropertyPaneResources = function () {
        return __awaiter(this, void 0, void 0, function () {
            var component;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, import(
                        /* webpackChunkName: 'AceMyNotifications-property-pane'*/
                        "./AceMyNotificationsPropertyPane")];
                    case 1:
                        component = _a.sent();
                        this._deferredPropertyPane = new component.AceMyNotificationsPropertyPane(this.context, this.properties, this.onPropertyPaneFieldChanged);
                        return [2 /*return*/];
                }
            });
        });
    };
    AceMyNotificationsAdaptiveCardExtension.prototype.renderCard = function () {
        return CARD_VIEW_REGISTRY_ID;
    };
    Object.defineProperty(AceMyNotificationsAdaptiveCardExtension.prototype, "disableReactivePropertyChanges", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    AceMyNotificationsAdaptiveCardExtension.prototype.getPropertyPaneConfiguration = function () {
        return this._deferredPropertyPane.getPropertyPaneConfiguration();
    };
    AceMyNotificationsAdaptiveCardExtension.prototype.handleNotifications = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var notifications, _i, notifications_1, notification, activities;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        notifications = JSON.parse(data).value;
                        _i = 0, notifications_1 = notifications;
                        _a.label = 1;
                    case 1:
                        if (!(_i < notifications_1.length)) return [3 /*break*/, 5];
                        notification = notifications_1[_i];
                        // get siteID from lists
                        console.log("notification", notification);
                        return [4 /*yield*/, services.getListActivities(selectedSiteId, selectedListId)];
                    case 2:
                        activities = _a.sent();
                        return [4 /*yield*/, _this.addActivityToList(activities[0])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return AceMyNotificationsAdaptiveCardExtension;
}(BaseAdaptiveCardExtension));
export default AceMyNotificationsAdaptiveCardExtension;
//# sourceMappingURL=AceMyNotificationsAdaptiveCardExtension.js.map