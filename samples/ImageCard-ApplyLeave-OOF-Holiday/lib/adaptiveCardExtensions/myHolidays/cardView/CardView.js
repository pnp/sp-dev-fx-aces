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
import * as strings from 'MyHolidaysAdaptiveCardExtensionStrings';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { QUICK_VIEW_REGISTRY_ID } from '../MyHolidaysAdaptiveCardExtension';
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
                    title: strings.QuickViewButton,
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
            var upcomingHoliday = !isEmpty(this.state.upcomingHoliday) ? this.state.upcomingHoliday.name + " " + this.state.upcomingHoliday.date.iso : "View Holiday";
            return {
                primaryText: upcomingHoliday,
                imageUrl: require('../assets/upcomingHoliday.png'),
                title: this.properties.title
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CardView.prototype, "onCardSelection", {
        get: function () {
            return {
                type: 'QuickView',
                parameters: {
                    view: QUICK_VIEW_REGISTRY_ID
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