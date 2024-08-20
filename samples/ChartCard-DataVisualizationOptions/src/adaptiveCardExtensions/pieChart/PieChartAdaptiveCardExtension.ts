import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { PieChartPropertyPane } from './PieChartPropertyPane';
import { QuickView } from './quickView/QuickView';

export interface IPieChartAdaptiveCardExtensionProps {
  title: string;
}

export interface IPieChartAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'PieChart_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'PieChart_QUICK_VIEW';


export default class PieChartAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IPieChartAdaptiveCardExtensionProps,
  IPieChartAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: PieChartPropertyPane;

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
      /* webpackChunkName: 'PieChart-property-pane'*/
      './PieChartPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.PieChartPropertyPane();
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
