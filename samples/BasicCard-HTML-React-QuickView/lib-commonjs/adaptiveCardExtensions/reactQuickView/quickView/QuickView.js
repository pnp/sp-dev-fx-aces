"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickView = void 0;
var tslib_1 = require("tslib");
var sp_adaptive_card_extension_base_1 = require("@microsoft/sp-adaptive-card-extension-base");
var React = tslib_1.__importStar(require("react"));
var ReactDOM = tslib_1.__importStar(require("react-dom"));
var QuickViewComponent_1 = tslib_1.__importDefault(require("./components/QuickViewComponent"));
var QuickView = /** @class */ (function (_super) {
    tslib_1.__extends(QuickView, _super);
    function QuickView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QuickView.prototype.render = function () {
        if (this.domElement) {
            var element = React.createElement(QuickViewComponent_1.default, {
                context: this.context, // Pass SharePoint context
                listName: this.properties.listName // Example data passed as props
            });
            ReactDOM.render(element, this.domElement); // Render the React component in the DOM
        }
        else {
            console.error("domElement is undefined");
        }
    };
    QuickView.prototype.dispose = function () {
        if (this.domElement) {
            ReactDOM.unmountComponentAtNode(this.domElement);
        }
        _super.prototype.dispose.call(this);
    };
    return QuickView;
}(sp_adaptive_card_extension_base_1.BaseWebQuickView));
exports.QuickView = QuickView;
//# sourceMappingURL=QuickView.js.map