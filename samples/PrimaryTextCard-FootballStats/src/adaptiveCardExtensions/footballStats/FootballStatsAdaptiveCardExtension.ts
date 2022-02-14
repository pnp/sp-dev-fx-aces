import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { AdaptiveCardExtensionContext, BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { StandingsView } from './quickView/StandingsView';
import { FootballStatsPropertyPane } from './FootballStatsPropertyPane';

export interface IFootballStatsAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
}

export interface IFootballStatsAdaptiveCardExtensionState {
  description: string;
  context: AdaptiveCardExtensionContext;
  standingsData: any[];
  standingCurrentIndex: number;
}

const CARD_VIEW_REGISTRY_ID: string = 'FootballStats_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'FootballStats_QUICK_VIEW';
export const STANDINGS_VIEW_REGISTRY_ID: string = 'FootballStats_STANDINGS_VIEW';

export default class FootballStatsAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IFootballStatsAdaptiveCardExtensionProps,
  IFootballStatsAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: FootballStatsPropertyPane | undefined;

  public onInit = async () => {
    this.state = {
      description: this.properties.description,
      context: this.context,
      standingsData: [],
      standingCurrentIndex: 0
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    this.quickViewNavigator.register(STANDINGS_VIEW_REGISTRY_ID, () => new StandingsView());
  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'FootballStats-property-pane'*/
      './FootballStatsPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.FootballStatsPropertyPane();
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
