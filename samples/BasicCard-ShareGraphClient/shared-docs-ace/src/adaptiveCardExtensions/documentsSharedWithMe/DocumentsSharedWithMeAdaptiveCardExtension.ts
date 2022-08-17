import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { DocumentsSharedWithMePropertyPane } from './DocumentsSharedWithMePropertyPane';
import { GraphClientProvider } from "graph-client-library";

export interface IDocumentsSharedWithMeAdaptiveCardExtensionProps {
  title: string;
}

export interface IDocumentsSharedWithMeAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'DocumentsSharedWithMe_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'DocumentsSharedWithMe_QUICK_VIEW';

export default class DocumentsSharedWithMeAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IDocumentsSharedWithMeAdaptiveCardExtensionProps,
  IDocumentsSharedWithMeAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: DocumentsSharedWithMePropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = { };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    //using as any for spfx version mismatch
    let graphClientProvider = this.context.serviceScope.consume<GraphClientProvider>(GraphClientProvider.serviceKey as any);
    let client = await graphClientProvider.getGraphClient();
    let sharedDocsResponse = await client.get("https://graph.microsoft.com/v1.0/me/insights/shared");
    let sharedDocs = await sharedDocsResponse.json();
    console.log(sharedDocs);
    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'DocumentsSharedWithMe-property-pane'*/
      './DocumentsSharedWithMePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.DocumentsSharedWithMePropertyPane();
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
