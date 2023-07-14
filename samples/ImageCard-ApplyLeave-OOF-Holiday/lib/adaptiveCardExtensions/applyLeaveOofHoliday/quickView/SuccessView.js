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
import { BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
var SuccessView = /** @class */ (function (_super) {
    __extends(SuccessView, _super);
    function SuccessView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SuccessView.prototype, "data", {
        get: function () {
            return {
                leaveHistory: this.state.leaveHistory,
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SuccessView.prototype, "template", {
        get: function () {
            return require('./template/SuccessViewTemplate.json');
        },
        enumerable: false,
        configurable: true
    });
    return SuccessView;
}(BaseAdaptiveCardView));
export { SuccessView };
//# sourceMappingURL=SuccessView.js.map