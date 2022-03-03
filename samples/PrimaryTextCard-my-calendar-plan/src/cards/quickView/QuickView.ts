import { Event } from "@microsoft/microsoft-graph-types";
import {
  BaseAdaptiveCardView,
  ISPFxAdaptiveCard,
} from "@microsoft/sp-adaptive-card-extension-base";

import {
  IMyDayAdaptiveCardExtensionProps,
  IMyDayAdaptiveCardExtensionState,
} from "../../adaptiveCardExtensions/myDay/MyDayAdaptiveCardExtension";

export interface IQuickViewData {
  title: string;
  userDisplayName: string;
  events: Event[];
  date: string;
  numberItems: string;
  timeZone: string;
  locale: string;
}

export class QuickView extends BaseAdaptiveCardView<
  IMyDayAdaptiveCardExtensionProps,
  IMyDayAdaptiveCardExtensionState,
  IQuickViewData
> {

  public get data(): IQuickViewData {
    return {
      title:this.state.title,
      userDisplayName:this.state.userDisplayName,
      events:this.state.events,
      date:this.state.date,
      numberItems:this.state.numberItems,
      timeZone:this.state.timeZone,
      locale:this.state.locale
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./../../templates/MyDay/MyDayCard.json');
  }
}
