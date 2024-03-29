import {
  BaseComponentsCardView,
  IDataVisualizationCardViewParameters,
  LineChartCardView,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  IDataPoint,
} from '@microsoft/sp-adaptive-card-extension-base';
import {
  IPageCreationAdaptiveCardExtensionProps,
  IPageCreationAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID,
} from '../PageCreationAdaptiveCardExtension';

// Sample Data
// const seriesData : IDataPoint<Date>[] = [
//   {
//     x: new Date(2024, 1, 1),
//     y: 1000
//   },
//   {
//     x: new Date(2024, 2, 1),
//     y: 2400
//   },
//   {
//     x: new Date(2024, 3, 1),
//     y: 2000
//   },
//   {
//     x: new Date(2024, 4, 1),
//     y: 2900
//   },
//   {
//     x: new Date(2024, 5, 1),
//     y: 3000
//   },
//   {
//     x: new Date(2024, 6, 1),
//     y: 3100
//   }
// ];

const pageData : IDataPoint<Date>[] = [
];

const newsData : IDataPoint<Date>[] = [
];

export class CardView extends BaseComponentsCardView<
  IPageCreationAdaptiveCardExtensionProps,
  IPageCreationAdaptiveCardExtensionState,
  IDataVisualizationCardViewParameters
> { 
  public get cardViewParameters(): IDataVisualizationCardViewParameters {

    this.state.pages.forEach((total: number, created: number) => {
      pageData.push(
        {
          x: new Date(2024,created,0),
          y: total
        }
      )
    });

    this.state.news.forEach((total: number, created: number) => {
      newsData.push(
        {
          x: new Date(2024,created,0),
          y: total
        }
      )
    });


    return LineChartCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title
      },
      body: {
        componentName: 'dataVisualization',
        dataVisualizationKind: 'line',
        series: [{
            data: pageData,
            lastDataPointLabel: '2'
        },
        {
          data: newsData,
          lastDataPointLabel: '2'
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
