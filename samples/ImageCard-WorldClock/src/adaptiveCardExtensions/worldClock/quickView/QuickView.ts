import {
  ISPFxAdaptiveCard,
  BaseAdaptiveCardQuickView,
} from "@microsoft/sp-adaptive-card-extension-base";
import {
  IWorldClockAdaptiveCardExtensionProps,
  IWorldClockAdaptiveCardExtensionState,
} from "../WorldClockAdaptiveCardExtension";
import { getTimezones, Timezone } from "./Timezones";

export interface IQuickViewData {
  timezones: Timezone[];
}

export class QuickView extends BaseAdaptiveCardQuickView<
  IWorldClockAdaptiveCardExtensionProps,
  IWorldClockAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      timezones: getTimezones(),
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require("./template/QuickViewTemplate.json");
  }
}
