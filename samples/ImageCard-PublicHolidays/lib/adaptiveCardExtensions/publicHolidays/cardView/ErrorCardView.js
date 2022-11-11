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
import * as strings from 'PublicHolidaysAdaptiveCardExtensionStrings';
var ErrorCardView = /** @class */ (function (_super) {
    __extends(ErrorCardView, _super);
    function ErrorCardView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ErrorCardView.prototype, "data", {
        get: function () {
            return {
                title: strings.ErrorOccuredText,
                primaryText: strings.SomethingWentWrongText,
                imageUrl: require('../assets/PublicHoliday.jpg')
            };
        },
        enumerable: false,
        configurable: true
    });
    return ErrorCardView;
}(BaseImageCardView));
export { ErrorCardView };
//# sourceMappingURL=ErrorCardView.js.map