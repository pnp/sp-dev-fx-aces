import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { BaseComponentContext } from "@microsoft/sp-component-base";
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { MostLikedPagesPropertyPane } from './MostLikedPagesPropertyPane';
import { Page } from '../types';
import { GraphServiceInstance } from '../GraphService';
import { getAllPages } from '../PagesData';
import { IPropertyFieldSite } from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';

export interface IMostLikedPagesAdaptiveCardExtensionProps {
  title: string;
  context: BaseComponentContext;
  selectedSites: IPropertyFieldSite[];
  selectedSource: string;
}

export interface IMostLikedPagesAdaptiveCardExtensionState {
  pages: Page[];
}

const CARD_VIEW_REGISTRY_ID: string = 'MostLikedPages_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'MostLikedPages_QUICK_VIEW';

export default class MostLikedPagesAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IMostLikedPagesAdaptiveCardExtensionProps,
  IMostLikedPagesAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: MostLikedPagesPropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      pages: null
    };

    GraphServiceInstance.context = this.context;

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    await this.loadPages();
    return Promise.resolve();
  }

  private async loadPages(): Promise<void> {
    let retrievedPages: Page[]
    if (this.properties.selectedSites.length > 0) {
      retrievedPages = await getAllPages(this.properties.selectedSites);
    } else {
      retrievedPages = await getAllPages([{
        id: this.context.pageContext.site.id.toString(),
        url: this.context.pageContext.site.absoluteUrl,
        title: this.context.pageContext.web.title,
      }]);
    }


    this.setState({
      pages: retrievedPages
    });
  }

  protected get selectedSites(): IPropertyFieldSite[] {
    return this.properties.selectedSites;
  }

  protected get selectedSource(): string {
    return this.properties.selectedSource;
  }

  protected onPropertyPaneFieldChanged = async (propertyPath: string, oldValue: any, newValue: any) => {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);

    if (propertyPath === "selectedSites" && newValue !== oldValue) {
      const site: IPropertyFieldSite[] = newValue as IPropertyFieldSite[];
      this.properties.selectedSites = site;
      this.loadPages();
    }
    this.renderCard();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'MostLikedPages-property-pane'*/
      './MostLikedPagesPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.MostLikedPagesPropertyPane(
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
