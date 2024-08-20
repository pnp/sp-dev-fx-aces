import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { BarChartPropertyPane } from './BarChartPropertyPane';
import { QuickView } from './quickView/QuickView';

export interface IBarChartAdaptiveCardExtensionProps {
  title: string;
}

export interface IBarChartAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'BarChart_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'BarChart_QUICK_VIEW';


export default class BarChartAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IBarChartAdaptiveCardExtensionProps,
  IBarChartAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: BarChartPropertyPane;

  public onInit(): Promise<void> {
    this.state = { };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    // registers the quick view to open via QuickView action
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'BarChart-property-pane'*/
      './BarChartPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.BarChartPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }
}
