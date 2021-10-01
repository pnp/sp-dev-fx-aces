import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { AceGraphUpcomingeventsPropertyPane } from './AceGraphUpcomingeventsPropertyPane';
import { graph } from '@pnp/graph';
import { PnPService } from '../service/Service';
import { IEvent } from '../models/IEvent';

export interface IAceGraphUpcomingeventsAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
  days: number;
}

export interface IAceGraphUpcomingeventsAdaptiveCardExtensionState {
  description: string;
  eventCount: number;
  events: IEvent[];
}

const CARD_VIEW_REGISTRY_ID: string = 'AceGraphUpcomingevents_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'AceGraphUpcomingevents_QUICK_VIEW';

export default class AceGraphUpcomingeventsAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IAceGraphUpcomingeventsAdaptiveCardExtensionProps,
  IAceGraphUpcomingeventsAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: AceGraphUpcomingeventsPropertyPane | undefined;
  private PnPService: PnPService = new PnPService();
  private events: IEvent[] = [];

  public async onInit(): Promise<void> {

    graph.setup({
      spfxContext: this.context
    });

    await this.PnPService._init(this.properties.days).then(response => {
      this.events = response;
    });

    this.state = {
      description: this.properties.description,
      eventCount: this.events.length,
      events: this.events
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

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
      /* webpackChunkName: 'AceGraphUpcomingevents-property-pane'*/
      './AceGraphUpcomingeventsPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.AceGraphUpcomingeventsPropertyPane();
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
