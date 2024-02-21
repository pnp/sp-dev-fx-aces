import type { IPropertyPaneConfiguration } from "@microsoft/sp-property-pane";
import { BaseAdaptiveCardExtension } from "@microsoft/sp-adaptive-card-extension-base";
import { CardView } from "./cardView/CardView";
import { QuickView } from "./quickView/QuickView";
import { WorldClockPropertyPane } from "./WorldClockPropertyPane";
import { DateTime } from "luxon";

export interface IWorldClockAdaptiveCardExtensionProps {
  title: string;
}

export interface IWorldClockAdaptiveCardExtensionState {
  localTime: string;
}

const CARD_VIEW_REGISTRY_ID: string = "WorldClock_CARD_VIEW";
export const QUICK_VIEW_REGISTRY_ID: string = "WorldClock_QUICK_VIEW";

export default class WorldClockAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IWorldClockAdaptiveCardExtensionProps,
  IWorldClockAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: WorldClockPropertyPane;

  constructor() {
    super();
    this.state = {
      localTime: "",
    };
  }

  public onInit(): Promise<void> {
    this.updateTime();
    const time = DateTime.now().toLocaleString(DateTime.TIME_24_SIMPLE);
    this.setState({
      localTime: time,
    });
    setInterval(() => {
      this.updateTime();
    }, 60000);

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(
      QUICK_VIEW_REGISTRY_ID,
      () => new QuickView(),
    );

    return Promise.resolve();
  }

  private updateTime(): void {
    const time = DateTime.now().toLocaleString(DateTime.TIME_24_SIMPLE);
    this.setState({
      localTime: time,
    });
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: "WorldClockPropertyPane" */ "./WorldClockPropertyPane"
    ).then((component) => {
      this._deferredPropertyPane = new component.WorldClockPropertyPane();
    });
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }
}
