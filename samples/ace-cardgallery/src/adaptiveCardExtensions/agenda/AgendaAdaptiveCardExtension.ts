import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';

import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { sp } from "@pnp/sp";

import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { AgendaPropertyPane } from './AgendaPropertyPane';
import { cg } from '../../services/cg.service';
import { Agenda } from '../../models/cg.models';

export interface IAgendaAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
}

export interface IAgendaAdaptiveCardExtensionState {
  currentIndex: number;
  agendas: Agenda[];
}

const CARD_VIEW_REGISTRY_ID: string = 'Agenda_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Agenda_QUICK_VIEW';

export default class AgendaAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IAgendaAdaptiveCardExtensionProps,
  IAgendaAdaptiveCardExtensionState
> {
  private LOG_SOURCE: string = "🔶 AgendaAdaptiveCardExtension";
  private _deferredPropertyPane: AgendaPropertyPane | undefined;

  public onInit(): Promise<void> {
    try {
      //Initialize PnPLogger
      Logger.subscribe(new ConsoleListener());
      Logger.activeLogLevel = LogLevel.Info;

      //Initialize PnPJs
      sp.setup({ spfxContext: this.context });

      cg.Init();

      const agendas: Agenda[] = cg.GetAgendas();

      this.state = {
        currentIndex: 0,
        agendas: agendas
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

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'Agenda-property-pane'*/
      './AgendaPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.AgendaPropertyPane();
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
