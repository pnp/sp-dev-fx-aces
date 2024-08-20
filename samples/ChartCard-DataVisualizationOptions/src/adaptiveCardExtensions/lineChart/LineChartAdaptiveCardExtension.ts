import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { LineChartPropertyPane } from './LineChartPropertyPane';
import { QuickView } from './quickView/QuickView';

export interface ILineChartAdaptiveCardExtensionProps {
  title: string;
}

export interface ILineChartAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'LineChart_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'LineChart_QUICK_VIEW';


export default class LineChartAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ILineChartAdaptiveCardExtensionProps,
  ILineChartAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: LineChartPropertyPane;

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
      /* webpackChunkName: 'LineChart-property-pane'*/
      './LineChartPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.LineChartPropertyPane();
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
