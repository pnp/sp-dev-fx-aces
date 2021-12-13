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
import { BasePrimaryTextCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'AceMyNotificationsAdaptiveCardExtensionStrings';
import { QUICK_VIEW_REGISTRY_ID } from '../../adaptiveCardExtensions/aceMyNotifications/AceMyNotificationsAdaptiveCardExtension';
var CardView = /** @class */ (function (_super) {
    __extends(CardView, _super);
    function CardView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CardView.prototype, "cardButtons", {
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
            var _a, _b, _c;
            var numberNotification = (_a = this.state.listNotifications.length) !== null && _a !== void 0 ? _a : 0;
            var messageCard = "No Notification(s)";
            if (numberNotification) {
                messageCard = numberNotification + " Notifications";
            }
            else {
                messageCard = "No Notifications";
            }
            return {
                primaryText: messageCard,
                description: (_c = (_b = this.properties.selectedList) === null || _b === void 0 ? void 0 : _b.title) !== null && _c !== void 0 ? _c : '',
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
}(BasePrimaryTextCardView));
export { CardView };
//# sourceMappingURL=CardView.js.map