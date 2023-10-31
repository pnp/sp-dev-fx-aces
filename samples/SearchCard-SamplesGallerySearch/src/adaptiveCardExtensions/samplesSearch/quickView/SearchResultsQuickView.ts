import { ISPFxAdaptiveCard, BaseAdaptiveCardQuickView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SamplesSearchAdaptiveCardExtensionStrings';
import {
  ISamplesSearchAdaptiveCardExtensionProps,
  ISamplesSearchAdaptiveCardExtensionState
} from '../SamplesSearchAdaptiveCardExtension';
import { ISampleItem } from '../samplesSearchService/ISearchResults';

export interface ISearchResultsQuickViewData {
  searchActionTitle: string;
  placeholder: string;
  queryString: string;
  searchResults?: ISampleItem[];
  isLoading: boolean;
}

export class SearchResultsQuickView extends BaseAdaptiveCardQuickView<
  ISamplesSearchAdaptiveCardExtensionProps,
  ISamplesSearchAdaptiveCardExtensionState,
  ISearchResultsQuickViewData
> {

  private _lastQueryString: string | undefined;

  public get data(): ISearchResultsQuickViewData {
    const isNewSearch: boolean = this._lastQueryString !== this.state.queryString;
    // initiate search if the query string has changed
    if (isNewSearch) {
      this.properties.searchSamples().then(() => { 
        this._lastQueryString = this.state.queryString;
        return; 
      })
      .catch(() => { return;});
    }
    
    return {
      searchActionTitle: strings.SearchAction,
      placeholder: strings.Placeholder,
      queryString: this.state.queryString || '',
      searchResults: this.state.searchResults,
      isLoading: isNewSearch
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/SearchResultsQuickViewTemplate.json');
  }

  public onAction(action: IActionArguments): void {
    if (action.type !== 'Submit' || !action.data) {
      return;
    }
    const {
      data
    } = action;
    if (data.id === 'search') {
      // update query string
      this.setState({
        queryString: data.queryString
      });
    }
  }
}
