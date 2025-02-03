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
                context: this.context,
                listName: this.properties.listName // Example data passed as props
            });
            ReactDOM.render(element, this.domElement); // Render the React component in the DOM
        }
        else {
            console.error("domElement is undefined");
        }
    };
    return QuickView;
}(BaseWebQuickView));
export { QuickView };
//# sourceMappingURL=QuickView.js.map