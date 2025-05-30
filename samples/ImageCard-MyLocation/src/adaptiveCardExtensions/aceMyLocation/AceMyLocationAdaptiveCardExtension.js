"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUICK_VIEW_REGISTRY_ID = void 0;
const sp_adaptive_card_extension_base_1 = require("@microsoft/sp-adaptive-card-extension-base");
const CardView_1 = require("./cardView/CardView");
const QuickView_1 = require("./quickView/QuickView");
const sp_1 = require("@pnp/sp");
require("@pnp/sp/webs");
require("@pnp/sp/lists");
require("@pnp/sp/items");
const CARD_VIEW_REGISTRY_ID = 'AceMyLocation_CARD_VIEW';
exports.QUICK_VIEW_REGISTRY_ID = 'AceMyLocation_QUICK_VIEW';
class AceMyLocationAdaptiveCardExtension extends sp_adaptive_card_extension_base_1.BaseAdaptiveCardExtension {
    onInit() {
        this.state = {};
        // Configure PnPjs
        this.sp = (0, sp_1.spfi)().using((0, sp_1.SPFx)(this.context));
        // Fetch the office URL and set the state
        this._getListItemByOfficeLocation().then(item => {
            if (item) {
                console.log("Office URL found:", item.URL);
                this.setState({ officeUrl: item.URL });
            }
            else {
                console.log("No office URL found.");
            }
        });
        // registers the card view to be shown in a dashboard
        this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView_1.CardView());
        // registers the quick view to open via QuickView action
        this.quickViewNavigator.register(exports.QUICK_VIEW_REGISTRY_ID, () => new QuickView_1.QuickView());
        return Promise.resolve();
    }
    _getOfficeLocation() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Fetching office location...");
            const userProperties = yield this._getUserProperties();
            const officeLocation = userProperties === null || userProperties === void 0 ? void 0 : userProperties.officeLocation;
            if (!officeLocation) {
                console.error("Office location not found.");
                return null;
            }
            console.log("Office location retrieved:", officeLocation);
            return officeLocation;
        });
    }
    _getUserProperties() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Fetching user properties...");
                const client = yield this.context.msGraphClientFactory.getClient("3");
                const user = yield client.api('/me').get();
                console.log("User properties retrieved:", user);
                return user;
            }
            catch (error) {
                console.error("Error fetching user properties:", error);
                return null;
            }
        });
    }
    _getListItemByOfficeLocation() {
        return __awaiter(this, void 0, void 0, function* () {
            const officeLocation = yield this._getOfficeLocation();
            if (!officeLocation) {
                console.error("Office location not found.");
                return null;
            }
            const listGUID = this.properties.listGUID;
            if (!listGUID) {
                console.error("List GUID is not configured.");
                return null;
            }
            try {
                console.log("Fetching list item for office location:", officeLocation);
                const items = yield this.sp.web.lists.getById(listGUID).items.filter(`Title eq '${officeLocation}'`).select("Title", "URL").top(1)();
                if (items.length > 0) {
                    console.log("List item retrieved:", items);
                    return items; // Return the first item
                }
                else {
                    console.log("No list item found for the given office location.");
                    return null;
                }
            }
            catch (error) {
                console.error("Error fetching list item:", error);
                return null;
            }
        });
    }
    loadPropertyPaneResources() {
        return Promise.resolve().then(() => require(
        /* webpackChunkName: 'AceMyLocation-property-pane'*/
        './AceMyLocationPropertyPane')).then((component) => {
            this._deferredPropertyPane = new component.AceMyLocationPropertyPane();
        });
    }
    renderCard() {
        return CARD_VIEW_REGISTRY_ID;
    }
    getPropertyPaneConfiguration() {
        return this._deferredPropertyPane.getPropertyPaneConfiguration();
    }
}
exports.default = AceMyLocationAdaptiveCardExtension;
//# sourceMappingURL=AceMyLocationAdaptiveCardExtension.js.map