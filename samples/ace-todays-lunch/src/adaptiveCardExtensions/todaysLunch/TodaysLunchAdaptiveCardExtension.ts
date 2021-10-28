import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";

import { TodaysLunchPropertyPane } from './TodaysLunchPropertyPane';
import { ILunch, Lunch, Weekday } from './models/ILunch';
import { todaysLunchService } from './services/TodaysLunchService';

export interface ITodaysLunchAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
}

export interface ITodaysLunchAdaptiveCardExtensionState {
  todaysLunch: ILunch | undefined;
}

const CARD_VIEW_REGISTRY_ID: string = 'TodaysLunch_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'TodaysLunch_QUICK_VIEW';

export default class TodaysLunchAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ITodaysLunchAdaptiveCardExtensionProps,
  ITodaysLunchAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: TodaysLunchPropertyPane | undefined;

  public onInit(): Promise<void> {   
    Logger.subscribe(new ConsoleListener());
    Logger.activeLogLevel = LogLevel.Info;

    this.state = {
      todaysLunch: new Lunch(0, 'Loading', 'Loading dishes...', Weekday.Sunday, true, '', 0)
    };

    todaysLunchService.init(this.context);
    todaysLunchService.getTodaysLunch().then(lunch => {
      this.setState({
        todaysLunch: lunch
      });
    });

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/todays_lunch.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'TodaysLunch-property-pane'*/
      './TodaysLunchPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.TodaysLunchPropertyPane();
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
