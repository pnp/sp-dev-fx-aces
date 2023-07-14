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
import moment from 'moment';
import { LEAVE_VIEW_REGISTRY_ID, QUICK_VIEW_REGISTRY_ID } from '../ApplyLeaveOofHolidayAdaptiveCardExtension';
var QuickView = /** @class */ (function (_super) {
    __extends(QuickView, _super);
    function QuickView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(QuickView.prototype, "data", {
        get: function () {
            return {
                isDateTrue: this.state.startDateIsGreater
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuickView.prototype, "template", {
        get: function () {
            return require('./template/QuickViewTemplate.json');
        },
        enumerable: false,
        configurable: true
    });
    QuickView.prototype.onAction = function (action) {
        try {
            if (action.type == "Submit") {
                var _a = action.data, startDate = _a.startDate, endDate = _a.endDate, leaveTypeId = _a.leaveTypeId, leaveDescId = _a.leaveDescId, setOOFId = _a.setOOFId;
                var isafter = moment(startDate).isAfter(endDate);
                //validation for check a date
                if (!isafter) {
                    this.quickViewNavigator.push(LEAVE_VIEW_REGISTRY_ID, true);
                    this.setState({
                        leaveInfo: { endDate: endDate, startDate: startDate, leaveType: leaveTypeId, leaveDescription: leaveDescId, isOOfEnabled: setOOFId === "1" ? true : false, oofMessage: null }
                    });
                }
                else {
                    this.setState({
                        startDateIsGreater: isafter
                    });
                    this.quickViewNavigator.push(QUICK_VIEW_REGISTRY_ID, false);
                }
            }
        }
        catch (err) {
            console.log("Exception occurred");
        }
    };
    return QuickView;
}(BaseAdaptiveCardView));
export { QuickView };
//# sourceMappingURL=QuickView.js.map