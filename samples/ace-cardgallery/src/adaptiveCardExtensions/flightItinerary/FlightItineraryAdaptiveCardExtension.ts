import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';

import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { spfi, SPFx } from "@pnp/sp";

import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { FlightItineraryPropertyPane } from './FlightItineraryPropertyPane';
import { cg } from '../../services/cg.service';
import { Reservation } from '../../models/cg.models';

export interface IFlightItineraryAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
}

export interface IFlightItineraryAdaptiveCardExtensionState {
  reservations: Reservation[];
  currentIndex: number;
}

const CARD_VIEW_REGISTRY_ID: string = 'FlightItinerary_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'FlightItinerary_QUICK_VIEW';

export default class FlightItineraryAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IFlightItineraryAdaptiveCardExtensionProps,
  IFlightItineraryAdaptiveCardExtensionState
> {
  private LOG_SOURCE: string = "🔶 FlightItineraryAdaptiveCardExtension";
  private _deferredPropertyPane: FlightItineraryPropertyPane | undefined;

  public async onInit(): Promise<void> {
    try {
      //Initialize PnPLogger
      Logger.subscribe(ConsoleListener());
      Logger.activeLogLevel = LogLevel.Info;

      //Initialize PnPJs
      spfi().using(SPFx(this.context));

      cg.Init();

      const reservations: Reservation[] = await cg.GetFlightItineraries();

      this.state = {
        reservations: reservations,
        currentIndex: 0
      };

      this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
      this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onInit) - ${err}`, LogLevel.Error);
    }
    return Promise.resolve();
  }

  public get title(): string {
    return this.properties.title;
  }

  public get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'FlightItinerary-property-pane'*/
      './FlightItineraryPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.FlightItineraryPropertyPane();
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
