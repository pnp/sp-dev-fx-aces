import { __extends } from "tslib";
import { BaseWebQuickView } from "@microsoft/sp-adaptive-card-extension-base";
import * as React from "react";
import * as ReactDOM from "react-dom";
import QuickViewComponent from "./components/QuickViewComponent";
var QuickView = /** @class */ (function (_super) {
    __extends(QuickView, _super);
    function QuickView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QuickView.prototype.render = function () {
        if (this.domElement) {
            var element = React.createElement(QuickViewComponent, {
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
}(BaseWebQuickView));
export { QuickView };
//# sourceMappingURL=QuickView.js.map