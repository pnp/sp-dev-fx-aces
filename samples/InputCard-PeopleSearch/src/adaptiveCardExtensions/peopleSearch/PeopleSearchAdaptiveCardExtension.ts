import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension, IOnBeforeActionArguments, IQuickViewActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { PeopleSearchPropertyPane } from './PeopleSearchPropertyPane';
import { IPerson } from './model/IPerson';
import { IPeopleSearchService } from './peopleSearchService/IPeopleSearchService';
import { PeopleSearchService } from './peopleSearchService/PeopleSearchService';

export interface IPeopleSearchAdaptiveCardExtensionProps {
  title: string;
}

export interface IPeopleSearchAdaptiveCardExtensionState {
  queryString?: string;
  suggested?: IPerson;
  results?: IPerson[];
  selectedPerson?: IPerson;
}

const CARD_VIEW_REGISTRY_ID: string = 'PeopleSearch_CARD_VIEW';
export const SEARCH_RESULTS_QUICK_VIEW_REGISTRY_ID: string = 'PeopleSearch_SEARCH_RESULTS_QUICK_VIEW';
export const ITEM_QUICK_VIEW_REGISTRY_ID: string = 'PeopleSearch_ITEM_QUICK_VIEW';
export const SEARCH_BOX_ID: string = 'searchBox';


export default class PeopleSearchAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IPeopleSearchAdaptiveCardExtensionProps,
  IPeopleSearchAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: PeopleSearchPropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = { };

    // request suggestion
    this.context.serviceScope.whenFinished(() => {
      // get the people search service
      const peopleSearchService: IPeopleSearchService = this.context.serviceScope.consume(PeopleSearchService.serviceKey);
      // request suggestion
      peopleSearchService.getSuggested()
      .then((suggested: IPerson) => {
        this.setState({
          suggested: suggested
        });
      })
      .catch((error: any) => {
        // TODO: handle error
      });
    });

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    // registers the defer-loaded quick view to show search results
    this.quickViewNavigator.register(SEARCH_RESULTS_QUICK_VIEW_REGISTRY_ID, () => {
      return import(/* webpackChunkName: 'PeopleSearch-search-results-qv'*/ './quickView/SearchResultsQuickView')
      .then(module => new module.SearchResultsQuickView());
    });
    // registers the defer-loaded quick view to show single search item details
    this.quickViewNavigator.register(ITEM_QUICK_VIEW_REGISTRY_ID, () => {
      return import(/* webpackChunkName: 'PeopleSearch-item-qv'*/ './quickView/ItemQuickView')
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
        const queryString: string = quickViewActionArguments.data?.[SEARCH_BOX_ID] || '';
        this.setState({
          queryString: queryString
        });
      }
    }
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'PeopleSearch-property-pane'*/
      './PeopleSearchPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.PeopleSearchPropertyPane();
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
