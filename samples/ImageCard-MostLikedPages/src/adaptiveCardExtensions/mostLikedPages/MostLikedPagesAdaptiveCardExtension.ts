import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { BaseComponentContext } from "@microsoft/sp-component-base";
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { MostLikedPagesPropertyPane } from './MostLikedPagesPropertyPane';
import { Page } from '../types';
import { GraphServiceInstance } from '../GraphService';
import { getAllPages } from '../PagesData';
import { SITE_TOGGLE_PREFIX } from '../types';
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
  private _availableSites: IPropertyFieldSite[] = [];

  public async onInit(): Promise<void> {
    this.state = {
      pages: []
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

    if (propertyPath === "selectedSource" && newValue !== oldValue) {
      if (newValue === "currentSite") {
        this.properties.selectedSites = [];
        await this.loadPages();
      }
      this.context.propertyPane?.refresh();
    }

    if (propertyPath.indexOf(SITE_TOGGLE_PREFIX) === 0) {
      const index: number = parseInt(propertyPath.substring(SITE_TOGGLE_PREFIX.length), 10);
      const site: IPropertyFieldSite | undefined = this._deferredPropertyPane?.getSiteByToggleIndex(index);
      if (site) {
        const current: IPropertyFieldSite[] = this.properties.selectedSites ?? [];
        if (newValue === true) {
          if (!current.some(s => s.id === site.id)) {
            this.properties.selectedSites = [...current, site];
          }
        } else {
          this.properties.selectedSites = current.filter(s => s.id !== site.id);
        }
        await this.loadPages();
      }
    }
    this.renderCard();
  }

  protected async loadPropertyPaneResources(): Promise<void> {
    const component = await import(
      /* webpackChunkName: 'MostLikedPages-property-pane'*/
      './MostLikedPagesPropertyPane'
    );
    this._availableSites = await GraphServiceInstance.GetSites();
    this._deferredPropertyPane = new component.MostLikedPagesPropertyPane(
      this.context,
      this.properties,
      this.onPropertyPaneFieldChanged,
      this._availableSites
    );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }


  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
}
