var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { BaseComponentsCardView, BasicCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'ReactQuickViewAdaptiveCardExtensionStrings';
import { QUICK_VIEW_REGISTRY_ID } from '../ReactQuickViewAdaptiveCardExtension';
var CardView = /** @class */ (function (_super) {
    __extends(CardView, _super);
    function CardView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CardView.prototype, "cardViewParameters", {
        get: function () {
            return BasicCardView({
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
                            view: QUICK_VIEW_REGISTRY_ID
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
}(BaseComponentsCardView));
export { CardView };
//# sourceMappingURL=CardView.js.map