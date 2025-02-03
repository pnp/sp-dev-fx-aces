import { BaseWebQuickView } from "@microsoft/sp-adaptive-card-extension-base";

import {
  IReactQuickViewAdaptiveCardExtensionProps,
  IReactQuickViewAdaptiveCardExtensionState,
} from "../ReactQuickViewAdaptiveCardExtension";
import * as React from "react";
import * as ReactDOM from "react-dom";
import QuickViewComponent from "./components/QuickViewComponent";

export class QuickView extends BaseWebQuickView<
  IReactQuickViewAdaptiveCardExtensionProps,
  IReactQuickViewAdaptiveCardExtensionState
> {
  public render(): void {
    if (this.domElement) {
      const element = React.createElement(QuickViewComponent, {
        context: this.context, // Pass SharePoint context
        listName: this.properties.listName // Example data passed as props
      });

      ReactDOM.render(element, this.domElement); // Render the React component in the DOM
    } else {
      console.error("domElement is undefined");
    }
  }
}
