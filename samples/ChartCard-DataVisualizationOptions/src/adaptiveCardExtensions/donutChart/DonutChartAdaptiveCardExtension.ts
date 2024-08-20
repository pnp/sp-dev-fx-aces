import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { DonutChartPropertyPane } from './DonutChartPropertyPane';
import { QuickView } from './quickView/QuickView';

export interface IDonutChartAdaptiveCardExtensionProps {
  title: string;
}

export interface IDonutChartAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'DonutChart_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'DonutChart_QUICK_VIEW';


export default class DonutChartAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IDonutChartAdaptiveCardExtensionProps,
  IDonutChartAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: DonutChartPropertyPane;

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
      /* webpackChunkName: 'DonutChart-property-pane'*/
      './DonutChartPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.DonutChartPropertyPane();
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
