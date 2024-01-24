import { ISPFxAdaptiveCard, BaseAdaptiveCardQuickView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SearchBoxAdaptiveCardExtensionStrings';
import {
  ISearchBoxAdaptiveCardExtensionProps,
  ISearchBoxAdaptiveCardExtensionState
} from '../SearchBoxAdaptiveCardExtension';

export interface ISearchResultsQuickViewData {
  searchActionTitle: string;
  placeholder: string;
  queryString: string;
}

export class SearchResultsQuickView extends BaseAdaptiveCardQuickView<
  ISearchBoxAdaptiveCardExtensionProps,
  ISearchBoxAdaptiveCardExtensionState,
  ISearchResultsQuickViewData
> {
  public get data(): ISearchResultsQuickViewData {
    return {
      searchActionTitle: strings.SearchAction,
      placeholder: strings.Placeholder,
      queryString: this.state.queryString || ''
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/SearchResultsQuickViewTemplate.json');
  }
}
