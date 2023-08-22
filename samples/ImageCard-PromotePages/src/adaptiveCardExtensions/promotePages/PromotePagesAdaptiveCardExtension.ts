import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { AdaptiveCardExtensionContext, BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { PageListView } from './pageListView/PageListView';
import { PromoteView } from './promoteView/PromoteView';
import { LoadingView } from './resultViews/LoadingView';
import { SuccessView } from './resultViews/SuccessView';
import { ErrorView } from './resultViews/ErrorView';
import { PromotePagesPropertyPane } from './PromotePagesPropertyPane';
import { GraphSitePage } from "./../types"
import { IPageHandler, PageHandler } from './../PageHandler';
import { GraphService, IGraphService } from '../GraphService';
import { IPropertyFieldSite } from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";

export interface IPromotePagesAdaptiveCardExtensionProps {
  title: string;
  context:AdaptiveCardExtensionContext;
  selectedSites: IPropertyFieldSite[];
  selectedSource: string;
}

export interface IPromotePagesAdaptiveCardExtensionState {
  pages: GraphSitePage[];
  currentPage: GraphSitePage;
}

const CARD_VIEW_REGISTRY_ID: string = 'PromotePages_CARD_VIEW';
export const PAGE_LIST_VIEW_REGISTRY_ID: string = 'PromotePages_PAGE_LIST_VIEW';
export const PROMOTE_VIEW_REGISTRY_ID: string = 'PromotePages_JOIN_VIEW';
export const LOADING_VIEW_REGISTRY_ID: string = 'PromotePages_LOADING_VIEW';
export const SUCCESS_VIEW_REGISTRY_ID: string = 'PromotePages_SUCCESS_VIEW';
export const ERROR_VIEW_REGISTRY_ID: string = 'PromotePages_ERROR_VIEW';

export default class PromotePagesAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IPromotePagesAdaptiveCardExtensionProps,
  IPromotePagesAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: PromotePagesPropertyPane;

  public async onInit(): Promise<void> {
    this.state = { 
      pages: [],
      currentPage: {
        id: "",
        title: "",
        parentSiteId: "",
        parentSiteTitle: "",
        webUrl: "",
        thumbnailWebUrl: "",
        description: "",
        lastModifiedDateTime: ""
      }
    };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(PAGE_LIST_VIEW_REGISTRY_ID, () => new PageListView());
    this.quickViewNavigator.register(PROMOTE_VIEW_REGISTRY_ID, () => new PromoteView());
    this.quickViewNavigator.register(LOADING_VIEW_REGISTRY_ID, () => new LoadingView());
    this.quickViewNavigator.register(SUCCESS_VIEW_REGISTRY_ID, () => new SuccessView());
    this.quickViewNavigator.register(ERROR_VIEW_REGISTRY_ID, () => new ErrorView());

    await this.loadPages();

    return Promise.resolve();
  }

  private async loadPages(): Promise<void> {
    let loadedPages: GraphSitePage[]
    const handler: IPageHandler = new PageHandler();
    const service: IGraphService = new GraphService(this.context)
    if (this.properties.selectedSites.length > 0) {
      loadedPages = await handler._getAllPages(service,this.properties.selectedSites);
    } else {
      loadedPages = await handler._getAllPages(service,[{
        id: this.context.pageContext.site.id.toString(),
        url: this.context.pageContext.site.absoluteUrl,
        title: this.context.pageContext.web.title,
      }]);
    }
    this.setState({
      pages: loadedPages
    });
  }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-function-return-type
    protected onPropertyPaneFieldChanged = async (propertyPath: string, oldValue: any, newValue: any) => {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);

    if (propertyPath === "selectedSites" && newValue !== oldValue) {
      const site: IPropertyFieldSite[] = newValue as IPropertyFieldSite[];
      this.properties.selectedSites = site;
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.loadPages();
    }
    this.renderCard();
  }
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'PromotePages-property-pane'*/
      './PromotePagesPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.PromotePagesPropertyPane(
            this.context,
            this.properties,
            this.onPropertyPaneFieldChanged
          );
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
