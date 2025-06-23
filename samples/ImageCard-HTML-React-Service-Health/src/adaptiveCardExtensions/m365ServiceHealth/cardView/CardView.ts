import * as strings from "M365ServiceHealthAdaptiveCardExtensionStrings";

import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ImageCardView,
} from "@microsoft/sp-adaptive-card-extension-base";
import {
  IM365ServiceHealthAdaptiveCardExtensionProps,
  IM365ServiceHealthAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID,
} from "../M365ServiceHealthAdaptiveCardExtension";

import microsoft365 from "../../../assets/Microsoft_365_Copilot.svg";
import { utils } from "../../../utils/utils";

export class CardView extends BaseComponentsCardView<
  IM365ServiceHealthAdaptiveCardExtensionProps,
  IM365ServiceHealthAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  private image = require("../../../assets/monitor-azure-service-health.png");
   
  public get cardViewParameters(): ComponentsCardViewParameters {
    const { data, error } = this.state;
    const { getHealthStatus } = utils();
    const healthStatus =  getHealthStatus(data);

    return ImageCardView({
      cardBar: {
        componentName: "cardBar",
        title: this.properties.title,
        icon: {
          url: microsoft365,
        },
      },
      header: {
        componentName: "text",
        text: error ? error.message : healthStatus as string,
      },

      image: {
        url: this.image,
        altText: "Microsoft 365 Copilot",
      },

      footer: {
        componentName: "cardButton",
        title: strings.QuickViewButton,

        action: {
          type: "QuickView",
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID,
          },
        },
      },
    });
  }

  public get onCardSelection():
    | IQuickViewCardAction
    | IExternalLinkCardAction
    | undefined {
    return {
      type: "QuickView",
      parameters: {
        view: QUICK_VIEW_REGISTRY_ID,
      },
    };
  }
}
