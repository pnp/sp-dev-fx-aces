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
var ErrorView = /** @class */ (function (_super) {
    __extends(ErrorView, _super);
    function ErrorView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ErrorView.prototype, "data", {
        get: function () {
            return {
                subTitle: "Error Occured while updating the location ",
                title: "User :  ",
                description: "Error :  ",
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ErrorView.prototype, "template", {
        get: function () {
            return require('./template/ErrorViewTemplate.json');
        },
        enumerable: false,
        configurable: true
    });
    ErrorView.prototype.onAction = function (action) {
        if (action.id === "close") {
            this.quickViewNavigator.pop();
        }
    };
    return ErrorView;
}(BaseAdaptiveCardView));
export { ErrorView };
//# sourceMappingURL=ErrorView.js.map