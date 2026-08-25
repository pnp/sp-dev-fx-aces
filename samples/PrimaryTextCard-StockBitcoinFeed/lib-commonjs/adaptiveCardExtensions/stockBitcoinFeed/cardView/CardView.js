"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardView = void 0;
var tslib_1 = require("tslib");
var sp_adaptive_card_extension_base_1 = require("@microsoft/sp-adaptive-card-extension-base");
var CardView = /** @class */ (function (_super) {
    tslib_1.__extends(CardView, _super);
    function CardView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CardView.prototype, "data", {
        get: function () {
            return {
                primaryText: "$ ".concat(this.state.lastPrice),
                description: this.properties.description,
                title: this.properties.title
            };
        },
        enumerable: false,
        configurable: true
    });
    return CardView;
}(sp_adaptive_card_extension_base_1.BasePrimaryTextCardView));
exports.CardView = CardView;
//# sourceMappingURL=CardView.js.map