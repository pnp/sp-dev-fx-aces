import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ImageCardView,
} from "@microsoft/sp-adaptive-card-extension-base";
import * as strings from "WorldClockAdaptiveCardExtensionStrings";
import {
  IWorldClockAdaptiveCardExtensionProps,
  IWorldClockAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID,
} from "../WorldClockAdaptiveCardExtension";
import CardHeader from "../assets/CardHeader.png";

export class CardView extends BaseComponentsCardView<
  IWorldClockAdaptiveCardExtensionProps,
  IWorldClockAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    return ImageCardView({
      image: {
        url: CardHeader,
      },
      cardBar: {
        componentName: "cardBar",
        title: this.properties.title,
      },
      header: {
        componentName: "text",
        text: `${strings.PrimaryText}:\n ${this.state.localTime}`,
      },
      footer: {
        componentName: "cardButton",
        title: strings.QuickViewButton,
        style: "positive",
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
