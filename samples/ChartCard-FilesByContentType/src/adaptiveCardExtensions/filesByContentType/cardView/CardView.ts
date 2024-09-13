import {
  BaseComponentsCardView,
  IDataVisualizationCardViewParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  IPieDataPoint,
  PieChartCardView,
} from '@microsoft/sp-adaptive-card-extension-base';
import {
  IFilesByContentTypeAdaptiveCardExtensionProps,
  IFilesByContentTypeAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID,
} from '../FilesByContentTypeAdaptiveCardExtension';

let fileSeries: IPieDataPoint[]= [];

export class CardView extends BaseComponentsCardView<
  IFilesByContentTypeAdaptiveCardExtensionProps,
  IFilesByContentTypeAdaptiveCardExtensionState,
  IDataVisualizationCardViewParameters
> {
  public get cardViewParameters(): IDataVisualizationCardViewParameters {
    fileSeries = [];
    this.properties.filesNumberByCtP.forEach(contentType =>{
        fileSeries.push({x: contentType.name, y: contentType.total}); 
    });
    this.properties.filesNumberByCtP = [];
    return PieChartCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title
      },
      body: {
        componentName: 'dataVisualization',
        dataVisualizationKind: 'pie',
        isDonut: false,
        series: [{
            data: fileSeries,
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
