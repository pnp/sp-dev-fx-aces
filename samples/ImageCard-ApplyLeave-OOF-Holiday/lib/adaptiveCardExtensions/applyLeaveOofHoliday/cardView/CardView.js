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
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { LEAVE_HISTORY_CONFIG_VIEW_REGISTRY_ID, QUICK_VIEW_REGISTRY_ID } from '../ApplyLeaveOofHolidayAdaptiveCardExtension';
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
            return [
                {
                    title: "Apply Leave",
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
    Object.defineProperty(CardView.prototype, "data", {
        get: function () {
            debugger;
            var _primaryText = "Apply leave & set out of office";
            if (this.state.appliedLeaves != undefined) {
                _primaryText = "You have applied leave from ".concat(this.state.appliedLeaves.startDate, " to ").concat(this.state.appliedLeaves.endDate);
            }
            return {
                primaryText: _primaryText,
                imageUrl: require('../assets/LeaveCal.jpg'),
                title: this.properties.title
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CardView.prototype, "onCardSelection", {
        get: function () {
            if (this.state.leaveHistory.length === 1 && isEmpty(this.state.leaveHistory[0].leaveType)) {
                {
                    return {
                        type: 'ExternalLink',
                        parameters: {
                            target: "https://google.com"
                        }
                    };
                }
            }
            else {
                return {
                    type: 'QuickView',
                    parameters: {
                        view: LEAVE_HISTORY_CONFIG_VIEW_REGISTRY_ID
                    }
                };
            }
        },
        enumerable: false,
        configurable: true
    });
    return CardView;
}(BaseImageCardView));
export { CardView };
//# sourceMappingURL=CardView.js.map