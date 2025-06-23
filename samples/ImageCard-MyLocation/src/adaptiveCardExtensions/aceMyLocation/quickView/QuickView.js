"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickView = void 0;
const sp_adaptive_card_extension_base_1 = require("@microsoft/sp-adaptive-card-extension-base");
const strings = require("AceMyLocationAdaptiveCardExtensionStrings");
class QuickView extends sp_adaptive_card_extension_base_1.BaseAdaptiveCardQuickView {
    get data() {
        return {
            subTitle: strings.SubTitle,
            title: strings.Title
        };
    }
    get template() {
        return require('./template/QuickViewTemplate.json');
    }
}
exports.QuickView = QuickView;
//# sourceMappingURL=QuickView.js.map