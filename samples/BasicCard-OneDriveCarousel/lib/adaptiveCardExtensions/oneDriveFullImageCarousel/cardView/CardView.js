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
import { BaseBasicCardView } from '@microsoft/sp-adaptive-card-extension-base';
var CardView = /** @class */ (function (_super) {
    __extends(CardView, _super);
    function CardView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CardView.prototype, "cardButtons", {
        get: function () {
            var buttons = [];
            return buttons;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CardView.prototype, "data", {
        get: function () {
            return {
                primaryText: this.getImageUrl()
            };
        },
        enumerable: false,
        configurable: true
    });
    CardView.prototype.getImageUrl = function () {
        if (this.state.error) {
            return require('../assets/Error.png');
        }
        var imageUrl = require('../assets/MicrosoftLogo.png');
        if (this.state.targetFolder && this.state.targetFolder.children && this.state.targetFolder.children.length > 0) {
            imageUrl = this.state.targetFolder.children[this.state.itemIndex].webUrl;
        }
        return imageUrl;
    };
    Object.defineProperty(CardView.prototype, "template", {
        get: function () {
            return (this.properties.fullBleed == true) ? require('./template/CardViewTemplate-bleed.json') : require('./template/CardViewTemplate.json');
        },
        enumerable: false,
        configurable: true
    });
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
}(BaseBasicCardView));
export { CardView };
//# sourceMappingURL=CardView.js.map