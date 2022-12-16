import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { SearchPropertyPane } from './SearchPropertyPane';
import { GraphSearchPagedDataProvider, IHttpClient, SPFxGraphHttpClient } from 'mgwdev-m365-helpers';
import { SearchResultsQuickView, SEARCH_RESULTS_QUICK_VIEW_REGISTRY_ID } from './quickView/SearchResultsQuickView';
import { ISearchResult } from '../../model/ISearchResult';

export interface ISearchAdaptiveCardExtensionProps {
  title: string;
  initialQuery?: string;
}

export interface ISearchAdaptiveCardExtensionState {
  searchItems?: ISearchResult[];
}

const CARD_VIEW_REGISTRY_ID: string = 'Search_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Search_QUICK_VIEW';

export default class SearchAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ISearchAdaptiveCardExtensionProps,
  ISearchAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: SearchPropertyPane | undefined;
  public async onInit(): Promise<void> {
    this.state = {};
    const graphClient: IHttpClient = new SPFxGraphHttpClient(await this.context.aadHttpClientFactory.getClient("https://graph.microsoft.com"));
    const dataProvider = new GraphSearchPagedDataProvider<ISearchResult>(graphClient, ["listItem"], [
      "id",
      "name",
      "title",
      "url",
      "lastModifiedDateTime",
      "siteTitle"
    ]);
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView(dataProvider, this.properties.initialQuery));
    this.quickViewNavigator.register(SEARCH_RESULTS_QUICK_VIEW_REGISTRY_ID, () => new SearchResultsQuickView());
    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'Search-property-pane'*/
      './SearchPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.SearchPropertyPane();
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
