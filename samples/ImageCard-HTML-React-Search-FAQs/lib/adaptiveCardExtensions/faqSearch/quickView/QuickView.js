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
import FAQs from "./components/FAQs";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Logger } from "@pnp/logging";
var QuickView = /** @class */ (function (_super) {
    __extends(QuickView, _super);
    function QuickView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Renders the QuickView by mounting the FAQs React component into the DOM.
     */
    QuickView.prototype.render = function () {
        try {
            if (!this.domElement) {
                Logger.write("Error: domElement is undefined. Cannot render QuickView.", 3 /* LogLevel.Error */);
                return;
            }
            // Create the React element and render it into the DOM
            var element = React.createElement(FAQs, {
                context: this.context,
                siteUrl: this.properties.siteUrl,
                faqListName: this.properties.faqListName,
                submitionListName: this.properties.submitionListName,
                faqCollectionData: this.properties.faqCollectionData,
                faqFilterLabel: this.properties.faqFilterLabel,
            });
            ReactDOM.render(element, this.domElement);
            Logger.write("QuickView successfully rendered.", 1 /* LogLevel.Info */);
        }
        catch (error) {
            Logger.write("Error occurred while rendering QuickView: ".concat(error.message), 3 /* LogLevel.Error */);
        }
    };
    /**
     * Cleans up resources when the QuickView is disposed by unmounting the React component.
     */
    QuickView.prototype.onDispose = function () {
        try {
            if (this.domElement) {
                ReactDOM.unmountComponentAtNode(this.domElement);
            }
            else {
                Logger.write("Warning: domElement is undefined during dispose.", 2 /* LogLevel.Warning */);
            }
        }
        catch (error) {
            Logger.write("Error occurred while disposing QuickView: ".concat(error.message), 3 /* LogLevel.Error */);
        }
    };
    return QuickView;
}(BaseWebQuickView));
export { QuickView };
//# sourceMappingURL=QuickView.js.map