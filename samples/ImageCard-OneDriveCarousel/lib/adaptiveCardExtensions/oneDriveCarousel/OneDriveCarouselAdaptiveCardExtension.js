import { __awaiter, __extends, __generator } from "tslib";
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import gu from './GraphUtility';
var CARD_VIEW_REGISTRY_ID = 'OneDriveCarousel_CARD_VIEW';
export var QUICK_VIEW_REGISTRY_ID = 'OneDriveCarousel_QUICK_VIEW';
var OneDriveCarouselAdaptiveCardExtension = /** @class */ (function (_super) {
    __extends(OneDriveCarouselAdaptiveCardExtension, _super);
    function OneDriveCarouselAdaptiveCardExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.loadDrives = function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.graphClient.api("/".concat(gu.path_me, "/").concat(gu.path_drives, "/").concat(this.state.rootDriveId, "/").concat(gu.path_root, "/").concat(gu.path_children))
                            .select("".concat(gu.prop_id, ",").concat(gu.prop_name))
                            .get(function (error, drives) {
                            if (error) {
                                _this.setError(error);
                                return;
                            }
                            _this.setState({
                                drivesResults: drives.value.map(function (v, i) { return { key: v.id, text: v.name }; })
                            });
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.loadTargetDriveItems = function () {
            _this.setState({
                isLoading: true
            });
            _this.graphClient.api("/".concat(gu.path_me, "/").concat(gu.path_drives, "/").concat(_this.state.rootDriveId, "/").concat(gu.path_items, "/").concat(_this.properties.selectedDriveId))
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
                    targetFolder: targetFolder,
                    folderHasImages: targetFolder.children && targetFolder.children.length > 0,
                    isLoading: false
                });
            })
                .catch(function (e) { return _this.setError(e); });
        };
        _this.updateImageIndex = function () {
            if (_this.state.targetFolder &&
                _this.state.targetFolder.children &&
                _this.state.targetFolder.children.length > 0) {
                var i = _this.state.itemIndex;
                if (_this.properties.randomizeImage === true) {
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
                error: error,
                isLoading: false
            });
            console.log(error);
        };
        return _this;
    }
    OneDriveCarouselAdaptiveCardExtension.prototype.onInit = function () {
        var _this = this;
        this.state = {
            description: this.properties.description,
            rootDriveId: undefined,
            drivesResults: undefined,
            itemIndex: 0,
            targetFolder: undefined,
            error: undefined,
            isLoading: true,
            folderHasImages: false
        };
        this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, function () { return new CardView(); });
        this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, function () { return new QuickView(); });
        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.context.msGraphClientFactory.getClient('3')];
                    case 1:
                        _a.graphClient = _b.sent();
                        // Get the first drive as root and load the children for the dropdown control
                        this.graphClient
                            .api("/".concat(gu.path_me, "/").concat(gu.path_drives))
                            .select("".concat(gu.prop_id, ",").concat(gu.prop_name))
                            .get(function (error, drives) {
                            if (error) {
                                _this.setError(error);
                                return;
                            }
                            _this.setState({
                                rootDriveId: (drives && drives.value && drives.value.length > 0) ? drives.value[0].id : undefined
                            });
                            if (_this.state.rootDriveId) {
                                _this.loadDrives().catch(function (e) { return _this.setError(e); });
                                if (_this.properties.selectedDriveId) {
                                    _this.loadTargetDriveItems();
                                    if (_this.properties.timerSeconds) {
                                        _this.updateImageTimer = setInterval(_this.updateImageIndex, (_this.properties.timerSeconds * 1000));
                                    }
                                }
                            }
                            else {
                                _this.setState({
                                    isLoading: false
                                });
                            }
                        })
                            .catch(function (e) { return _this.setError(e); });
                        return [2 /*return*/];
                }
            });
        }); }, 500);
        return Promise.resolve();
    };
    Object.defineProperty(OneDriveCarouselAdaptiveCardExtension.prototype, "title", {
        get: function () {
            return this.properties.title;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OneDriveCarouselAdaptiveCardExtension.prototype, "iconProperty", {
        get: function () {
            return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
        },
        enumerable: false,
        configurable: true
    });
    OneDriveCarouselAdaptiveCardExtension.prototype.loadPropertyPaneResources = function () {
        var _this = this;
        return import(
        /* webpackChunkName: 'OneDriveCarousel-property-pane'*/
        './OneDriveCarouselPropertyPane')
            .then(function (component) {
            _this._deferredPropertyPane = new component.OneDriveCarouselPropertyPane();
        });
    };
    OneDriveCarouselAdaptiveCardExtension.prototype.onPropertyPaneFieldChanged = function (propertyPath, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }
        if (propertyPath === "selectedDriveId") {
            this.loadTargetDriveItems();
        }
        else if (propertyPath === "timerSeconds") {
            clearInterval(this.updateImageTimer);
            this.updateImageTimer = setInterval(this.updateImageIndex, (this.properties.timerSeconds * 1000));
        }
    };
    OneDriveCarouselAdaptiveCardExtension.prototype.renderCard = function () {
        return CARD_VIEW_REGISTRY_ID;
    };
    OneDriveCarouselAdaptiveCardExtension.prototype.getPropertyPaneConfiguration = function () {
        return this._deferredPropertyPane.getPropertyPaneConfiguration(this.state.drivesResults);
    };
    OneDriveCarouselAdaptiveCardExtension.prototype.randomIndex = function (min, max) {
        var result = Math.floor(Math.random() * (max - min + 1) + min);
        // Avoid displaying the same image again
        if (result === this.state.itemIndex) {
            return this.randomIndex(min, max);
        }
        return result;
    };
    return OneDriveCarouselAdaptiveCardExtension;
}(BaseAdaptiveCardExtension));
export default OneDriveCarouselAdaptiveCardExtension;
//# sourceMappingURL=OneDriveCarouselAdaptiveCardExtension.js.map