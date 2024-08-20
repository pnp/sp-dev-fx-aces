import {
  BaseComponentsCardView,
  IDataVisualizationCardViewParameters,
  BarChartCardView,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  IDataPoint,
} from '@microsoft/sp-adaptive-card-extension-base';
import {
  IBarChartAdaptiveCardExtensionProps,
  IBarChartAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID,
} from '../BarChartAdaptiveCardExtension';

// Sample Data
const seriesData: IDataPoint<string>[] = [
  { x: "Jan", y: 12986 },
  { x: "Feb", y: 13424 },
  { x: "Mar", y: 17118 },
  { x: "Apr", y: 14017 },
  { x: "May", y: 11245 }
];

const seriesData2: IDataPoint<string>[] = [
  { x: "Jan", y: 19631},
  { x: "Feb", y: 19905},
  { x: "Mar", y: 17098},
  { x: "Apr", y: 11918},
  { x: "May", y: 10357}
];

const seriesData3: IDataPoint<string>[] = [
  { x: "Jan", y: 19762},
  { x: "Feb", y: 12926},
  { x: "Mar", y: 17670}, 
  { x: "Apr", y: 19055},
  { x: "May", y: 18142}
];

export class CardView extends BaseComponentsCardView<
  IBarChartAdaptiveCardExtensionProps,
  IBarChartAdaptiveCardExtensionState,
  IDataVisualizationCardViewParameters
> {
  public get cardViewParameters(): IDataVisualizationCardViewParameters {
    return BarChartCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title
      },
      body: {
        componentName: 'dataVisualization',
        dataVisualizationKind: 'bar',
        series: [{
            data: seriesData,
            name: 'Africa'
        }, {
            data: seriesData2,
            name: 'Asia'
        }, {
            data: seriesData3,
            name: 'Europe'
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
