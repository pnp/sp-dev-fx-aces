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
import { PropertyPaneButton, PropertyPaneButtonType, PropertyPaneLabel, PropertyPaneTextField, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import spService from './services/spprovider';
import * as strings from 'DynamicAceAdaptiveCardExtensionStrings';
var CARD_VIEW_REGISTRY_ID = 'DynamicAce_CARD_VIEW';
export var QUICK_VIEW_REGISTRY_ID = 'DynamicAce_QUICK_VIEW';
var DynamicAceAdaptiveCardExtension = /** @class */ (function (_super) {
    __extends(DynamicAceAdaptiveCardExtension, _super);
    function DynamicAceAdaptiveCardExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._spService = null;
        _this.listItems = [];
        return _this;
    }
    DynamicAceAdaptiveCardExtension.prototype.onInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, fixture;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._spService = new spService(this.context);
                        //Get the items for the current user;
                        _a = this;
                        return [4 /*yield*/, this._spService.getListItems(this.properties.listName)];
                    case 1:
                        //Get the items for the current user;
                        _a.listItems = _b.sent();
                        console.log(this.listItems);
                        this.state = {
                            items: this.listItems,
                            currentIndex: 0,
                            currentitem: this.listItems[0],
                            clickedview: false
                        };
                        fixture = function () {
                            if (_this.state.clickedview) {
                                return;
                            }
                            var currentIndex = _this.state.currentIndex;
                            currentIndex = currentIndex < (_this.state.items.length - 1) ? currentIndex + 1 : 0;
                            if (!_this.state.clickedview) {
                                _this.setState({
                                    currentitem: _this.state.items[currentIndex],
                                    currentIndex: currentIndex
                                });
                                if (!_this.state.clickedview) {
                                    setTimeout(fixture, 4000);
                                }
                            }
                        };
                        if (this.properties.autoRotate) {
                            fixture();
                        }
                        this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, function () { return new CardView(); });
                        this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, function () { return new QuickView(); });
                        return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    Object.defineProperty(DynamicAceAdaptiveCardExtension.prototype, "title", {
        get: function () {
            return this.properties.title;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DynamicAceAdaptiveCardExtension.prototype, "iconProperty", {
        get: function () {
            return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
        },
        enumerable: false,
        configurable: true
    });
    DynamicAceAdaptiveCardExtension.prototype.btnListSchemaCreation = function (val) {
        var colListColumns = ['CardViewTitle', 'CardViewDescription', 'StartDate', 'EndDate', 'OnCardSelectionType', 'ExternalLinkURL', 'QuickViewAdaptiveCardJSON', 'QuickViewAdaptiveCardData'];
        console.log("colListColumns: ", colListColumns);
        var listName = this.properties.listName;
        console.log("listName: ", listName);
        this._spService._createListwithColumns(listName, colListColumns).then(function (res) {
            console.log(res);
            //this.properties.propertyListOperationMessage = result;
            //this.context.propertyPane.refresh();  
            alert(res);
        }).catch(function (error) {
            console.log("Something went wrong! please contact admin for more information.", error);
            // this.properties.propertyListOperationMessage = "Something went wrong! please contact admin for more information."
            // this.context.propertyPane.refresh(); 
            var errMessage = (error.mesaage || error.Mesaage);
            alert("Something went wrong! please contact admin for more information. " + errMessage);
        });
    };
    DynamicAceAdaptiveCardExtension.prototype.loadPropertyPaneResources = function () {
        var _this = this;
        return import(
        /* webpackChunkName: 'DynamicAce-property-pane'*/
        './DynamicAcePropertyPane')
            .then(function (component) {
            _this._deferredPropertyPane = new component.DynamicAcePropertyPane();
        });
    };
    DynamicAceAdaptiveCardExtension.prototype.renderCard = function () {
        return CARD_VIEW_REGISTRY_ID;
    };
    // protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    //   return this._deferredPropertyPane!.getPropertyPaneConfiguration();
    // }
    DynamicAceAdaptiveCardExtension.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: { description: strings.PropertyPaneDescription },
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                PropertyPaneTextField('title', {
                                    label: strings.TitleFieldLabel
                                }),
                                PropertyPaneTextField('iconProperty', {
                                    label: strings.IconPropertyFieldLabel
                                }),
                                PropertyPaneTextField('listName', {
                                    label: "ListName"
                                }),
                                PropertyPaneLabel('listName', {
                                    text: "Enter list name and use below button to create required list"
                                }),
                                PropertyPaneButton('propertyListSchemaButton', {
                                    text: "Create List",
                                    buttonType: PropertyPaneButtonType.Primary,
                                    onClick: this.btnListSchemaCreation.bind(this)
                                }),
                                PropertyPaneToggle('autoRotate', {
                                    label: "Auto Rotate"
                                }),
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return DynamicAceAdaptiveCardExtension;
}(BaseAdaptiveCardExtension));
export default DynamicAceAdaptiveCardExtension;
//# sourceMappingURL=DynamicAceAdaptiveCardExtension.js.map