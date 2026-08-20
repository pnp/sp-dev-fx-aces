import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { NewsFeedCardPropertyPane } from './NewsFeedCardPropertyPane';
import { spfi, SPFx } from '@pnp/sp';
import '@pnp/sp/search';
import { ISearchQuery, ISearchResult } from '@pnp/sp/search';

export interface INewsFeedCardAdaptiveCardExtensionProps {
  title: string;
}

export interface INewsFeedCardAdaptiveCardExtensionState {
  news: ISearchResult[]|undefined,
  totalNews: number;
}

const CARD_VIEW_REGISTRY_ID: string = 'NewsFeedCard_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'NewsFeedCard_QUICK_VIEW';

export default class NewsFeedCardAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  INewsFeedCardAdaptiveCardExtensionProps,
  INewsFeedCardAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: NewsFeedCardPropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = { news: undefined, totalNews: 0 };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    const sp = spfi().using(SPFx(this.context));

    const d = new Date(new Date().setDate(new Date().getDate() - 30).valueOf());

    return sp.search(<ISearchQuery>{
      Querytext: `IsDocument:True AND FileExtension:aspx AND PromotedState:2 AND LastModifiedTime>=${d.toISOString()}`
    }).then((results) => {
      this.setState({ news: results.PrimarySearchResults, totalNews: results.TotalRows });
    });
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'NewsFeedCard-property-pane'*/
      './NewsFeedCardPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.NewsFeedCardPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
}
