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
var LoadingView = /** @class */ (function (_super) {
    __extends(LoadingView, _super);
    function LoadingView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(LoadingView.prototype, "data", {
        get: function () {
            return {
                title: "Request is in progress....",
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LoadingView.prototype, "template", {
        get: function () {
            return require('./template/LoadingViewTemplate.json');
        },
        enumerable: false,
        configurable: true
    });
    return LoadingView;
}(BaseAdaptiveCardView));
export { LoadingView };
//# sourceMappingURL=LoadingView.js.map