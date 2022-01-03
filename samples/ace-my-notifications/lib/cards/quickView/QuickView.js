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
var QuickView = /** @class */ (function (_super) {
    __extends(QuickView, _super);
    function QuickView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onAction = function (action) {
            if (action.id === "ClearAll") {
                _this.setState({ listNotifications: [] });
            }
            if (action.id === "Remove") {
                var listNotifications = _this.state.listNotifications;
                var r = pullAt(listNotifications, [action.data.index]);
                _this.setState({ listNotifications: listNotifications });
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
//# sourceMappingURL=QuickView.js.map