import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { IPagedDataProvider } from 'mgwdev-m365-helpers';
import * as strings from 'SearchAdaptiveCardExtensionStrings';
import { ISearchResult } from '../../../model/ISearchResult';
import { ISearchAdaptiveCardExtensionProps, ISearchAdaptiveCardExtensionState } from '../SearchAdaptiveCardExtension';
import { SEARCH_RESULTS_QUICK_VIEW_REGISTRY_ID } from './SearchResultsQuickView';

export interface IQuickViewData {
  subTitle: string;
  title: string;
}

export class QuickView extends BaseAdaptiveCardView<
  ISearchAdaptiveCardExtensionProps,
  ISearchAdaptiveCardExtensionState,
  IQuickViewData
> {
  constructor(protected dataProvider: IPagedDataProvider<ISearchResult>, protected initialQuery?: string){
    super();
  }
  public get data(): IQuickViewData {
    return {
      subTitle: strings.SubTitle,
      title: strings.Title
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }

  public onAction(action: IActionArguments): void {
    if(action.id === "submitSearchQueryBtn"){
      let query = (action as {data: {searchInput: string}}).data.searchInput;
      if(this.initialQuery){
        query += ` AND ${this.initialQuery}`
      }
      this.dataProvider.setQuery(query);
      this.dataProvider.getData().then((data) => {
        this.setState({
          searchItems: data
        });
        this.quickViewNavigator.push(SEARCH_RESULTS_QUICK_VIEW_REGISTRY_ID)
      }).catch(ex=>console.log(ex));
    }
  }
}