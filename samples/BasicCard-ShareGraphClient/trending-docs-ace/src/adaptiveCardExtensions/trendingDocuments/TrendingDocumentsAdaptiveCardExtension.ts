import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { TrendingDocumentsPropertyPane } from './TrendingDocumentsPropertyPane';
import { GraphClientProvider } from "graph-client-library";

export interface ITrendingDocumentsAdaptiveCardExtensionProps {
  title: string;
}

export interface ITrendingDocumentsAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'TrendingDocuments_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'TrendingDocuments_QUICK_VIEW';

export default class TrendingDocumentsAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ITrendingDocumentsAdaptiveCardExtensionProps,
  ITrendingDocumentsAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: TrendingDocumentsPropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = { };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    
    //using as any for spfx version mismatch
    let graphClientProvider = this.context.serviceScope.consume<GraphClientProvider>(GraphClientProvider.serviceKey as any);
    let client = await graphClientProvider.getGraphClient();
    let trendingDocsResponse = await client.get("https://graph.microsoft.com/v1.0/me/insights/trending");
    let trendingDocs = await trendingDocsResponse.json();
    console.log(trendingDocs);

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'TrendingDocuments-property-pane'*/
      './TrendingDocumentsPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.TrendingDocumentsPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
}
