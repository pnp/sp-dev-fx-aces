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
import { BaseImageCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'OneDriveCarouselAdaptiveCardExtensionStrings';
import { QUICK_VIEW_REGISTRY_ID } from '../OneDriveCarouselAdaptiveCardExtension';
var CardView = /** @class */ (function (_super) {
    __extends(CardView, _super);
    function CardView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CardView.prototype, "cardButtons", {
        /**
         * Buttons will not be visible if card size is 'Medium' with Image Card View.
         * It will support up to two buttons for 'Large' card size.
         */
        get: function () {
            var buttons = [];
            if (!this.state.error && !this.state.isLoading && this.state.folderHasImages &&
                (this.properties.hideButtons == undefined || this.properties.hideButtons == false) &&
                this.state.targetFolder != undefined) {
                buttons = [
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
            }
            return buttons;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CardView.prototype, "data", {
        get: function () {
            return {
                primaryText: this.getPrimaryText(),
                imageUrl: this.getImageUrl()
            };
        },
        enumerable: false,
        configurable: true
    });
    CardView.prototype.getPrimaryText = function () {
        if (this.state.error) {
            return strings.ErrorMessage;
        }
        var primaryText = strings.PrimaryText;
        if (this.properties.description) {
            primaryText = this.properties.description;
        }
        else if (this.state.targetFolder) {
            primaryText = this.state.targetFolder.name;
        }
        return primaryText;
    };
    CardView.prototype.getImageUrl = function () {
        if (this.state.error) {
            return require('../assets/Error.png');
        }
        // If not loading
        if (this.state.isLoading == false) {
            // If there is an image set the image webUrl
            if (this.state.targetFolder && this.state.targetFolder.children && this.state.targetFolder.children.length > 0) {
                return this.state.targetFolder.children[this.state.itemIndex].webUrl;
            }
            // If there are no images in the target folder set a default image
            if (this.state.folderHasImages == false) {
                return require("../assets/MicrosoftLogo.png");
            }
        }
        return require("../assets/loading.svg");
    };
    Object.defineProperty(CardView.prototype, "onCardSelection", {
        get: function () {
            return {
                type: 'ExternalLink',
                parameters: {
                    target: (this.state.targetFolder) ? this.state.targetFolder.webUrl : "https://onedrive.com/"
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