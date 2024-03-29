import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { PageCreationPropertyPane } from './PageCreationPropertyPane';
import { QuickView } from './quickView/QuickView';
import { PageService, IPageService } from '../PageService';
import { GraphPages } from '../types';

export interface IPageCreationAdaptiveCardExtensionProps {
  title: string;
}

export interface IPageCreationAdaptiveCardExtensionState {
  pages: Map<number, number>,
  news: Map<number, number>
}

const CARD_VIEW_REGISTRY_ID: string = 'PageCreation_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'PageCreation_QUICK_VIEW';


export default class PageCreationAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IPageCreationAdaptiveCardExtensionProps,
  IPageCreationAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: PageCreationPropertyPane;

  public async onInit(): Promise<void> {
    this.state = {
      pages: new Map<number, number>(),
      news: new Map<number, number>()
     };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    // registers the quick view to open via QuickView action
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    
    await this.getAllPages();

    return Promise.resolve();
  }

  private async getAllPages(): Promise<void> {
    const currentYear = new Date (Date.now()).getFullYear();
    const service: IPageService = new PageService(this.context);
    const allPages: GraphPages = await service._getPages();
    const pages = allPages.value.filter(p => p.promotionKind == "page" && new Date(p.createdDateTime).getFullYear() == currentYear).map(page => new Date(page.createdDateTime).getMonth());
    const newsPost = allPages.value.filter(p => p.promotionKind == "newsPost" && new Date(p.createdDateTime).getFullYear() == currentYear).map(news => new Date(news.createdDateTime).getMonth());

    const pagesMap = new Map<number, number>();
    pages.forEach(p => {
      if (!pagesMap.has(p)) {
        pagesMap.set(p, 1);
      } else {
        pagesMap.set(p, pagesMap.get(p) + 1)
      }
    });

    const newsMap = new Map<number, number>();
    newsPost.forEach(n => {
      if (!newsMap.has(n)) {
        newsMap.set(n, 1);
      } else {
        newsMap.set(n, newsMap.get(n) + 1)
      }
    });

    this.setState({
      pages: pagesMap,
      news: newsMap
    });

  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'PageCreation-property-pane'*/
      './PageCreationPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.PageCreationPropertyPane();
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
