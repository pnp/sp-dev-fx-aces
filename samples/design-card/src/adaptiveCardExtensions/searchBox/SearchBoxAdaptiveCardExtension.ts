import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import {
  BaseAdaptiveCardExtension,
  type IOnBeforeActionArguments,
  type IQuickViewActionArguments
} from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { SearchBoxPropertyPane } from './SearchBoxPropertyPane';

export interface ISearchBoxAdaptiveCardExtensionProps {
  title: string;
}

export interface ISearchBoxAdaptiveCardExtensionState {
  queryString?: string;
}

const CARD_VIEW_REGISTRY_ID: string = 'SearchBox_CARD_VIEW';
export const SEARCH_RESULTS_QUICK_VIEW_REGISTRY_ID: string = 'SearchBox_SEARCH_RESULTS_QUICK_VIEW';
export const ITEM_QUICK_VIEW_REGISTRY_ID: string = 'SearchBox_ITEM_QUICK_VIEW';
export const SEARCH_BOX_ID: string = 'searchBox';


export default class SearchBoxAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ISearchBoxAdaptiveCardExtensionProps,
  ISearchBoxAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: SearchBoxPropertyPane;

  public onInit(): Promise<void> {
    this.state = { };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    // registers the defer-loaded quick view to show search results
    this.quickViewNavigator.register(SEARCH_RESULTS_QUICK_VIEW_REGISTRY_ID, () => {
      return import(/* webpackChunkName: 'SearchBox-search-results-qv'*/ './quickView/SearchResultsQuickView')
      .then(module => new module.SearchResultsQuickView());
    });
    // registers the defer-loaded quick view to show single search item details
    this.quickViewNavigator.register(ITEM_QUICK_VIEW_REGISTRY_ID, () => {
      return import(/* webpackChunkName: 'SearchBox-item-qv'*/ './quickView/ItemQuickView')
      .then(module => new module.ItemQuickView());
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
      /* webpackChunkName: 'SearchBox-property-pane'*/
      './SearchBoxPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.SearchBoxPropertyPane();
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
