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
import gu from './GraphUtility';
var CARD_VIEW_REGISTRY_ID = 'OneDriveFullImageCarousel_CARD_VIEW';
export var QUICK_VIEW_REGISTRY_ID = 'OneDriveFullImageCarousel_QUICK_VIEW';
var OneDriveFullImageCarouselAdaptiveCardExtension = /** @class */ (function (_super) {
    __extends(OneDriveFullImageCarouselAdaptiveCardExtension, _super);
    function OneDriveFullImageCarouselAdaptiveCardExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.loadDrives = function () { return __awaiter(_this, void 0, void 0, function () {
            var graphClient;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.context.msGraphClientFactory.getClient()];
                    case 1:
                        graphClient = _a.sent();
                        return [4 /*yield*/, graphClient.api("/" + gu.path_me + "/" + gu.path_drives + "/" + this.state.rootDriveId + "/" + gu.path_root + "/" + gu.path_children)
                                .select(gu.prop_id + "," + gu.prop_name)
                                .get(function (error, drives) {
                                if (error) {
                                    _this.setError(error);
                                    return;
                                }
                                _this.setState({
                                    drivesResults: drives.value.map(function (v, i) { return { key: v.id, text: v.name }; })
                                });
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.loadTargetDriveItems = function () {
            _this.context.msGraphClientFactory.getClient().then(function (client) {
                client.api("/" + gu.path_me + "/" + gu.path_drives + "/" + _this.state.rootDriveId + "/" + gu.path_items + "/" + _this.properties.selectedDriveId)
                    .expand(gu.path_children)
                    .get(function (error, targetFolder) {
                    if (error) {
                        _this.setError(error);
                        return;
                    }
                    if (targetFolder && targetFolder.children) {
                        // Remove the non image children
                        targetFolder.children = targetFolder.children.filter(function (c) { return c.image; });
                    }
                    _this.setState({
                        targetFolder: targetFolder
                    });
                });
            });
        };
        _this.updateImageIndex = function () {
            if (_this.state.targetFolder &&
                _this.state.targetFolder.children &&
                _this.state.targetFolder.children.length > 0) {
                var i = _this.state.itemIndex;
                if (_this.properties.randomizeImage == true) {
                    i = _this.randomIndex(0, _this.state.targetFolder.children.length - 1);
                }
                else {
                    i++;
                    if (i >= _this.state.targetFolder.children.length) {
                        i = 0;
                    }
                }
                _this.setState({
                    itemIndex: i
                });
            }
        };
        _this.setError = function (error) {
            _this.setState({
                error: error
            });
            console.log(error);
        };
        return _this;
    }
    OneDriveFullImageCarouselAdaptiveCardExtension.prototype.onInit = function () {
        var _this = this;
        this.state = {
            rootDriveId: undefined,
            drivesResults: undefined,
            itemIndex: 0,
            targetFolder: undefined,
            error: undefined
        };
        this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, function () { return new CardView(); });
        // Get the first drive as root and load the children for the dropdown control
        this.context.msGraphClientFactory.getClient().then(function (client) {
            client
                .api("/" + gu.path_me + "/" + gu.path_drives)
                .select(gu.prop_id + "," + gu.prop_name)
                .get(function (error, drives) {
                if (error) {
                    _this.setError(error);
                    return;
                }
                _this.setState({
                    rootDriveId: (drives && drives.value && drives.value.length > 0) ? drives.value[0].id : undefined
                });
                _this.loadDrives();
                if (_this.properties.selectedDriveId) {
                    _this.loadTargetDriveItems();
                    if (_this.properties.timerMinutes) {
                        _this.updateImageTimer = setInterval(_this.updateImageIndex, (_this.properties.timerMinutes * 60 * 1000));
                    }
                }
            });
        });
        return Promise.resolve();
    };
    OneDriveFullImageCarouselAdaptiveCardExtension.prototype.loadPropertyPaneResources = function () {
        var _this = this;
        return import(
        /* webpackChunkName: 'OneDriveFullImageCarousel-property-pane'*/
        './OneDriveFullImageCarouselPropertyPane')
            .then(function (component) {
            _this._deferredPropertyPane = new component.OneDriveFullImageCarouselPropertyPane();
        });
    };
    OneDriveFullImageCarouselAdaptiveCardExtension.prototype.onPropertyPaneFieldChanged = function (propertyPath, oldValue, newValue) {
        if (oldValue == newValue) {
            return;
        }
        if (propertyPath == "selectedDriveId") {
            this.loadTargetDriveItems();
        }
        else if (propertyPath == "timerMinutes") {
            clearInterval(this.updateImageTimer);
            this.updateImageTimer = setInterval(this.updateImageIndex, (this.properties.timerMinutes * 60 * 1000));
        }
    };
    OneDriveFullImageCarouselAdaptiveCardExtension.prototype.renderCard = function () {
        return CARD_VIEW_REGISTRY_ID;
    };
    OneDriveFullImageCarouselAdaptiveCardExtension.prototype.getPropertyPaneConfiguration = function () {
        return this._deferredPropertyPane.getPropertyPaneConfiguration(this.state.drivesResults);
    };
    OneDriveFullImageCarouselAdaptiveCardExtension.prototype.randomIndex = function (min, max) {
        var result = Math.floor(Math.random() * (max - min + 1) + min);
        // Avoid displaying the same image again
        if (result == this.state.itemIndex) {
            return this.randomIndex(min, max);
        }
        return result;
    };
    return OneDriveFullImageCarouselAdaptiveCardExtension;
}(BaseAdaptiveCardExtension));
export default OneDriveFullImageCarouselAdaptiveCardExtension;
//# sourceMappingURL=OneDriveFullImageCarouselAdaptiveCardExtension.js.map