import {
  BaseComponentsCardView,
  IDataVisualizationCardViewParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  PieChartCardView,
} from '@microsoft/sp-adaptive-card-extension-base';
import {
  IFilesByContentTypeAdaptiveCardExtensionProps,
  IFilesByContentTypeAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID,
} from '../FilesByContentTypeAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  IFilesByContentTypeAdaptiveCardExtensionProps,
  IFilesByContentTypeAdaptiveCardExtensionState,
  IDataVisualizationCardViewParameters
> {

  public get cardViewParameters(): IDataVisualizationCardViewParameters {
    return PieChartCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title
      },
      header: {
        componentName: 'text',
        text: this.properties.listTitle
      },
      body: {
        componentName: 'dataVisualization',
        dataVisualizationKind: 'pie',
        isDonut: true,
        series: [{
            data: this.state.filesNumberByCtP
        }]
      },
      footer: {
        componentName: 'cardButton',
        title: 'View Details',
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
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
