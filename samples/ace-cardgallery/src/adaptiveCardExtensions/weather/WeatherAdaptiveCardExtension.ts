import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';

import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { sp } from "@pnp/sp";

import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { WeatherPropertyPane } from './WeatherPropertyPane';
import { cg } from '../../services/cg.service';
import { Location } from '../../models/cg.models';

export interface IWeatherAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
}

export interface IWeatherAdaptiveCardExtensionState {
  currentLocationId: number;
  locations: Location[];
}

const CARD_VIEW_REGISTRY_ID: string = 'Weather_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Weather_QUICK_VIEW';

export default class WeatherAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IWeatherAdaptiveCardExtensionProps,
  IWeatherAdaptiveCardExtensionState
> {
  private LOG_SOURCE: string = "🔶 WeatherAdaptiveCardExtension";
  private _deferredPropertyPane: WeatherPropertyPane | undefined;

  public async onInit(): Promise<void> {
    try {
      //Initialize PnPLogger
      Logger.subscribe(new ConsoleListener());
      Logger.activeLogLevel = LogLevel.Info;

      //Initialize PnPJs
      sp.setup({ spfxContext: this.context });

      await cg.Init();

      const locations: Location[] = cg.GetLocations();

      this.state = {
        currentLocationId: 0,
        locations: locations,
      };

      this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
      this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (data) - ${err}`, LogLevel.Error);
    }
    return Promise.resolve();
  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'Weather-property-pane'*/
      './WeatherPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.WeatherPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
}
