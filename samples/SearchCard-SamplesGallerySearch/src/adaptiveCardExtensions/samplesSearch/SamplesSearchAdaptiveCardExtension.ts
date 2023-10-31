import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import {
  BaseAdaptiveCardExtension,
  type IOnBeforeActionArguments,
  type IQuickViewActionArguments
} from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { SamplesSearchPropertyPane } from './SamplesSearchPropertyPane';

import { ISamplesSearchService } from './samplesSearchService/ISamplesSearchService';
import { SamplesSearchService } from './samplesSearchService/SamplesSearchService';
import { ISampleItem } from './samplesSearchService/ISearchResults';

export interface ISamplesSearchAdaptiveCardExtensionProps {
  searchServiceUri: string;
  searchSamples: () => Promise<void>;
  getSuggestedSample: () => Promise<void>;
}

export interface ISamplesSearchAdaptiveCardExtensionState {
  queryString?: string;
  searchResults?: ISampleItem[];
  suggestedSample?: ISampleItem | undefined;
}

const CARD_VIEW_REGISTRY_ID: string = 'SamplesSearch_CARD_VIEW';
export const SEARCH_RESULTS_QUICK_VIEW_REGISTRY_ID: string = 'SamplesSearch_SEARCH_RESULTS_QUICK_VIEW';
export const SEARCH_BOX_ID: string = 'searchBox';


export default class SamplesSearchAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ISamplesSearchAdaptiveCardExtensionProps,
  ISamplesSearchAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: SamplesSearchPropertyPane;
  private _samplesSearchService: ISamplesSearchService;

  public onInit(): Promise<void> {
    this.state = { };

    this.context.serviceScope.whenFinished(() => {
      // Get the samples search service instance
      this._samplesSearchService = this.context.serviceScope.consume(SamplesSearchService.serviceKey);
      // Init the samples search service instance
      if (this.properties.searchServiceUri) {
        this._samplesSearchService.init(this.properties.searchServiceUri);
      }
    });

    // Configure the properties for providing search capabilities
    this.properties.searchSamples = this.searchSamples;
    this.properties.getSuggestedSample = this.getSuggestedSample;

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    // registers the defer-loaded quick view to show search results
    this.quickViewNavigator.register(SEARCH_RESULTS_QUICK_VIEW_REGISTRY_ID, () => {
      return import(/* webpackChunkName: 'SamplesSearch-search-results-qv'*/ './quickView/SearchResultsQuickView')
      .then(module => new module.SearchResultsQuickView());
    });

    return Promise.resolve();
  }

  public onBeforeAction(action: IOnBeforeActionArguments): void {
    if (action.type === 'QuickView') {
      //
      // for the QuickView action we can get search query from the data property.
      // it allows to display the same query string in the quick view's text input.
      //
      const quickViewActionArguments: IQuickViewActionArguments = action as IQuickViewActionArguments;
      if (quickViewActionArguments.viewId === SEARCH_RESULTS_QUICK_VIEW_REGISTRY_ID) {
        this.setState({
          queryString: quickViewActionArguments.data && quickViewActionArguments.data[SEARCH_BOX_ID]
        });
      }
    }
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'SamplesSearch-property-pane'*/
      './SamplesSearchPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.SamplesSearchPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }

  protected getSuggestedSample = async(): Promise<void> => {
    const suggested: ISampleItem | undefined = await this._samplesSearchService.getSuggested(this.state.queryString || '');
    this.setState({
      suggestedSample: suggested
    });
  }

  protected searchSamples = async(): Promise<void> => {
    const searchResults: ISampleItem[] = await this._samplesSearchService.search(this.state.queryString || '');
    this.setState({
      searchResults: searchResults
    });
  }
}
