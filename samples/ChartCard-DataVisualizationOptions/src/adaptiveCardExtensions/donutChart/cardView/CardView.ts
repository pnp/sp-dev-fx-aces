import {
  BaseComponentsCardView,
  IDataVisualizationCardViewParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  PieChartCardView,
  IPieDataPoint
} from '@microsoft/sp-adaptive-card-extension-base';
import {
  IDonutChartAdaptiveCardExtensionProps,
  IDonutChartAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID,
} from '../DonutChartAdaptiveCardExtension';

// Sample Data
const seriesData: IPieDataPoint[] = [
  { x: 'January', y: 50 },
  { x: 'February', y: 25, color: '#eaae32', showLabel: false },
  { x: 'March', y: 40, showLabel: false },
  { x: 'Apr', y: 35 },
  { x: 'May', y: 60 },
  { x: 'Jun', y: 29 }
];


export class CardView extends BaseComponentsCardView<
  IDonutChartAdaptiveCardExtensionProps,
  IDonutChartAdaptiveCardExtensionState,
  IDataVisualizationCardViewParameters
> {
  public get cardViewParameters(): IDataVisualizationCardViewParameters {
    return PieChartCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title
      },
      body: {
        componentName: 'dataVisualization',
        dataVisualizationKind: 'pie',
        isDonut: true,
        series: [{
            data: seriesData,
        }]
      }
    });
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'QuickView',
      parameters: {
        view: QUICK_VIEW_REGISTRY_ID
      }
    };
  }
}
