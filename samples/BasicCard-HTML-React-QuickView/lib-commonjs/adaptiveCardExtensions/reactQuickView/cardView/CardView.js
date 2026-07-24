"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardView = void 0;
var tslib_1 = require("tslib");
var sp_adaptive_card_extension_base_1 = require("@microsoft/sp-adaptive-card-extension-base");
var strings = tslib_1.__importStar(require("ReactQuickViewAdaptiveCardExtensionStrings"));
var ReactQuickViewAdaptiveCardExtension_1 = require("../ReactQuickViewAdaptiveCardExtension");
var CardView = /** @class */ (function (_super) {
    tslib_1.__extends(CardView, _super);
    function CardView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CardView.prototype, "cardViewParameters", {
        get: function () {
            return (0, sp_adaptive_card_extension_base_1.BasicCardView)({
                cardBar: {
                    componentName: 'cardBar',
                    title: this.properties.title
                },
                header: {
                    componentName: 'text',
                    text: strings.PrimaryText
                },
                footer: {
                    componentName: 'cardButton',
                    title: strings.QuickViewButton,
                    action: {
                        type: 'QuickView',
                        parameters: {
                            view: ReactQuickViewAdaptiveCardExtension_1.QUICK_VIEW_REGISTRY_ID
                        }
                    }
                }
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CardView.prototype, "onCardSelection", {
        get: function () {
            return {
                type: 'ExternalLink',
                parameters: {
                    target: 'https://www.bing.com'
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    return CardView;
}(sp_adaptive_card_extension_base_1.BaseComponentsCardView));
exports.CardView = CardView;
//# sourceMappingURL=CardView.js.map