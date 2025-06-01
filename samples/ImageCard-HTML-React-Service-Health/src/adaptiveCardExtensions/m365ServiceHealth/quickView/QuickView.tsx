import * as React from "react";
import * as ReactDom from "react-dom";

import {
  IM365ServiceHealthAdaptiveCardExtensionProps,
  IM365ServiceHealthAdaptiveCardExtensionState,
} from "../M365ServiceHealthAdaptiveCardExtension";

import { BaseWebQuickView } from "@microsoft/sp-adaptive-card-extension-base";
import { EScope } from "../../../constants/EScope";
import { RenderQuickView } from "../../../components/renderQuickView/RenderQuickView";

export class QuickView extends BaseWebQuickView<
  IM365ServiceHealthAdaptiveCardExtensionProps,
  IM365ServiceHealthAdaptiveCardExtensionState
> {
 
  async render(): Promise<void> {
    ReactDom.render(
      <RenderQuickView
        data={this.state.data}
        theme={this.state.theme}
        scope={(this.properties.scope as EScope) ?? EScope.ADMINS}
        error={this.state.error}
      />,
      this.domElement
    );
  }

  public onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
}
