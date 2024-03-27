import {
  BaseComponentsCardView,
  IDataVisualizationCardViewParameters,
  LineChartCardView,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  IDataPoint,
} from '@microsoft/sp-adaptive-card-extension-base';
import {
  IRecentSalesAdaptiveCardExtensionProps,
  IRecentSalesAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID,
} from '../RecentSalesAdaptiveCardExtension';

// Sample Data
const seriesData : IDataPoint<Date>[] = [
  {
    x: new Date(2024, 1, 1),
    y: 1000
  },
  {
    x: new Date(2024, 2, 1),
    y: 2400
  },
  {
    x: new Date(2024, 3, 1),
    y: 2000
  },
  {
    x: new Date(2024, 4, 1),
    y: 2900
  },
  {
    x: new Date(2024, 5, 1),
    y: 3000
  },
  {
    x: new Date(2024, 6, 1),
    y: 3100
  }
];

const seriesData2 : IDataPoint<Date>[] = [
  {
    x: new Date(2024, 1, 1),
    y: 600
  },
  {
    x: new Date(2024, 2, 1),
    y: 1200
  },
  {
    x: new Date(2024, 3, 1),
    y: 3200
  },
  {
    x: new Date(2024, 4, 1),
    y: 2800
  },
  {
    x: new Date(2024, 5, 1),
    y: 3600
  },
  {
    x: new Date(2024, 6, 1),
    y: 4500
  }
];

const seriesData3 : IDataPoint<Date>[] = [
  {
    x: new Date(2024, 1, 1),
    y: 5200
  },
  {
    x: new Date(2024, 2, 1),
    y: 1000
  },
  {
    x: new Date(2024, 3, 1),
    y: 1800
  },
  {
    x: new Date(2024, 4, 1),
    y: 2900
  },
  {
    x: new Date(2024, 5, 1),
    y: 600
  },
  {
    x: new Date(2024, 6, 1),
    y: 400
  }
];

export class CardView extends BaseComponentsCardView<
  IRecentSalesAdaptiveCardExtensionProps,
  IRecentSalesAdaptiveCardExtensionState,
  IDataVisualizationCardViewParameters
> {
  public get cardViewParameters(): IDataVisualizationCardViewParameters {
    return LineChartCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title
      },
      body: {
        componentName: 'dataVisualization',
        dataVisualizationKind: 'line',
        series: [{
            data: seriesData,
            lastDataPointLabel: '3.1K'
        },
        {
          data: seriesData2,
          lastDataPointLabel: '4.5K',
          color: '#800080'
        },
        {
          data: seriesData3,
          lastDataPointLabel: '0.4K',
          color: '#01CBAE'
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
