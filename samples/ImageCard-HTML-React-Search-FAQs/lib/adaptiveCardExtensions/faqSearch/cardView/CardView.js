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
import { BaseImageCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { QUICK_VIEW_REGISTRY_ID, } from '../FaqSearchAdaptiveCardExtension';
import * as strings from 'FaqSearchAdaptiveCardExtensionStrings';
var CardView = /** @class */ (function (_super) {
    __extends(CardView, _super);
    function CardView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CardView.prototype, "data", {
        // Provide the image card data
        get: function () {
            return {
                title: this.properties.title || strings.Title,
                primaryText: this.properties.heading || strings.PrimaryText,
                imageUrl: this.getImageUrl(),
                imageAltText: strings.ImageAltText || 'FAQ Image' // Alt text for the image
            };
        },
        enumerable: false,
        configurable: true
    });
    CardView.prototype.getImageUrl = function () {
        if (this.properties.imageUrl) {
            return this.properties.imageUrl;
        }
        return require("../assets/faqs-image.jpg");
    };
    Object.defineProperty(CardView.prototype, "cardButtons", {
        get: function () {
            return [
                {
                    title: strings.QuickViewButton,
                    action: {
                        type: 'QuickView',
                        parameters: {
                            view: QUICK_VIEW_REGISTRY_ID
                        }
                    }
                }
            ];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CardView.prototype, "onCardSelection", {
        // Define what happens when the card is selected (click action)
        get: function () {
            return {
                type: 'ExternalLink',
                parameters: {
                    target: 'https://www.bing.com' // Replace with your target URL
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    return CardView;
}(BaseImageCardView));
export { CardView };
//# sourceMappingURL=CardView.js.map