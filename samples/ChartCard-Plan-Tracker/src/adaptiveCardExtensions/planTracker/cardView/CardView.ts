import {
  BaseComponentsCardView,
  IDataVisualizationCardViewParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  PieChartCardView,
  IPieDataPoint
} from '@microsoft/sp-adaptive-card-extension-base';

import {
  IPlanTrackerAdaptiveCardExtensionProps,
  IPlanTrackerAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID,
} from '../PlanTrackerAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  IPlanTrackerAdaptiveCardExtensionProps,
  IPlanTrackerAdaptiveCardExtensionState,
  IDataVisualizationCardViewParameters
> {
  public get cardViewParameters(): IDataVisualizationCardViewParameters {
    const statusCounts = this.state.taskStatusCounts || {
      notStarted: 0,
      inProgress: 0,
      completed: 0
    };

    const chartData: IPieDataPoint[] = (this.properties.statusCollection ?? []).map(item => {
      let count = 0;

      switch (item.name) {
        case 'Not Started':
          count = statusCounts.notStarted;
          break;
        case 'In Progress':
          count = statusCounts.inProgress;
          break;
        case 'Completed':
          count = statusCounts.completed;
          break;
        default:
          break;
      }

      return {
        x: item.shortName,
        y: count,
        color: item.color
      };
    });


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
          data: chartData,
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
