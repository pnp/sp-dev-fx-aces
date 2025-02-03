import { BaseWebQuickView } from "@microsoft/sp-adaptive-card-extension-base";
import { IFaqSearchAdaptiveCardExtensionProps, IFaqSearchAdaptiveCardExtensionState } from "../FaqSearchAdaptiveCardExtension";
import FAQs from "./components/FAQs";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Logger, LogLevel } from "@pnp/logging";

export class QuickView extends BaseWebQuickView<
  IFaqSearchAdaptiveCardExtensionProps,
  IFaqSearchAdaptiveCardExtensionState
> {
  /**
   * Renders the QuickView by mounting the FAQs React component into the DOM.
   */
  public render(): void {
    try {
      if (!this.domElement) {
        Logger.write("Error: domElement is undefined. Cannot render QuickView.", LogLevel.Error);
        return;
      }

      // Create the React element and render it into the DOM
      const element = React.createElement(FAQs, {
        context: this.context,
        siteUrl: this.properties.siteUrl,
        faqListName: this.properties.faqListName,
        submitionListName: this.properties.submitionListName,
        faqCollectionData: this.properties.faqCollectionData,
        faqFilterLabel: this.properties.faqFilterLabel,
      });

      ReactDOM.render(element, this.domElement);
      Logger.write("QuickView successfully rendered.", LogLevel.Info);

    } catch (error) {
      Logger.write(`Error occurred while rendering QuickView: ${error.message}`, LogLevel.Error);
    }
  }

  /**
   * Cleans up resources when the QuickView is disposed by unmounting the React component.
   */
  public onDispose(): void {
    try {
      if (this.domElement) {
        ReactDOM.unmountComponentAtNode(this.domElement);
      } else {
        Logger.write("Warning: domElement is undefined during dispose.", LogLevel.Warning);
      }
    } catch (error) {
      Logger.write(`Error occurred while disposing QuickView: ${error.message}`, LogLevel.Error);
    }
  }
}
