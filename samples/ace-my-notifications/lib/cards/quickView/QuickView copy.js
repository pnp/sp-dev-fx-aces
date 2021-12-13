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
import { BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { pullAt } from "lodash";
import { listNotificationsCard } from "../../templates";
import { QUICK_VIEW_REGISTRY_ID } from './../../adaptiveCardExtensions/aceMyNotifications/AceMyNotificationsAdaptiveCardExtension';
var QuickView = /** @class */ (function (_super) {
    __extends(QuickView, _super);
    function QuickView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onAction = function (action) {
            if (action.id === "Remove") {
                console.log(action.data);
                var listNotifications = _this.state.listNotifications;
                var rv = pullAt(listNotifications, [action.data.index]);
                _this.setState({ listNotifications: listNotifications });
                _this.quickViewNavigator.push(QUICK_VIEW_REGISTRY_ID);
            }
        };
        return _this;
    }
    Object.defineProperty(QuickView.prototype, "data", {
        get: function () {
            return {
                title: this.properties.title,
                listNotifications: this.state.listNotifications
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuickView.prototype, "template", {
        get: function () {
            return listNotificationsCard;
            //return require('./template/QuickViewTemplate.json');
        },
        enumerable: false,
        configurable: true
    });
    return QuickView;
}(BaseAdaptiveCardView));
export { QuickView };
//# sourceMappingURL=QuickView copy.js.map