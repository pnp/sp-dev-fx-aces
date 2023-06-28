import { ISPFxAdaptiveCard, BaseAdaptiveCardQuickView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PeopleSearchAdaptiveCardExtensionStrings';
import { IPeopleSearchAdaptiveCardExtensionProps, IPeopleSearchAdaptiveCardExtensionState, ITEM_QUICK_VIEW_REGISTRY_ID } from '../PeopleSearchAdaptiveCardExtension';
import { PeopleSearchService } from '../peopleSearchService/PeopleSearchService';
import { IPerson } from '../model/IPerson';

export interface ISearchResultsQuickViewData {
  searchActionTitle: string;
  placeholder: string;
  queryString: string;
  /**
   * The number of results returned by the search
   */
  numberOfResults: number;
  /**
   * The results returned by the search
   */
  results: IPerson[];
  /**
   * Indicates if the search is in progress
   */
  isLoading: boolean;
}

export class SearchResultsQuickView extends BaseAdaptiveCardQuickView<
  IPeopleSearchAdaptiveCardExtensionProps,
  IPeopleSearchAdaptiveCardExtensionState,
  ISearchResultsQuickViewData
> {
  private _lastQueryString: string | undefined;

  public get data(): ISearchResultsQuickViewData {
    const isNewSearch: boolean = this._lastQueryString !== this.state.queryString;
    // initiate search if the query string has changed
    if (isNewSearch) {
      this._performSearch(this.state.queryString);
    }

    const {
      results
    } = this.state;

    return {
      searchActionTitle: strings.SearchAction,
      placeholder: strings.Placeholder,
      queryString: this.state.queryString || '',
      numberOfResults: isNewSearch ? 0 : results?.length,
      results: isNewSearch ? [] : results,
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
    switch (data.id) {
      case 'search':
        // update query string
        this.setState({
          queryString: data.queryString
        });
        break;
      case 'selectPerson': {
        // set selected person and open the item quick view
        const person: IPerson = this.state.results.filter(p => p.id === data.personId)[0];
        this.setState({
          selectedPerson: person
        });
        this.quickViewNavigator.push(ITEM_QUICK_VIEW_REGISTRY_ID);
        break;
      }
    }
  }

  private _performSearch = (queryString: string): void => {
    // initiate search
    this.context.serviceScope.consume(PeopleSearchService.serviceKey).search(queryString)
    .then((results: IPerson[]) => {
      // storing the last processed query string
      this._lastQueryString = queryString;
      this.setState({
        results: results
      });
    })
    .catch(() => {
      // TODO: handle error
    });
  };
}