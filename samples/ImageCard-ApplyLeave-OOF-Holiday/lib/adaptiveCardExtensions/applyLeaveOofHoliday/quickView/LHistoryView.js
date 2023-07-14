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
import { HOLIDAY_CONFIG_VIEW_REGISTRY_ID } from '../ApplyLeaveOofHolidayAdaptiveCardExtension';
var LHistoryView = /** @class */ (function (_super) {
    __extends(LHistoryView, _super);
    function LHistoryView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(LHistoryView.prototype, "data", {
        get: function () {
            return {
                leaveHistory: this.state.leaveHistory,
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LHistoryView.prototype, "template", {
        get: function () {
            return require('./template/LeaveHistoryViewTemplate.json');
        },
        enumerable: false,
        configurable: true
    });
    LHistoryView.prototype.onAction = function (action) {
        try {
            if (action.type == "Submit") {
                this.quickViewNavigator.push(HOLIDAY_CONFIG_VIEW_REGISTRY_ID, false);
            }
        }
        catch (err) {
            console.log("Exception occurred");
        }
    };
    return LHistoryView;
}(BaseAdaptiveCardView));
export { LHistoryView };
//# sourceMappingURL=LHistoryView.js.map