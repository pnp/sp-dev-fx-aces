import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { NewsFeedCardPropertyPane } from './NewsFeedCardPropertyPane';
import { ISearchQuery, ISearchResult, PermissionKind, spfi, SPFx } from '@pnp/sp/presets/all';

export interface INewsFeedCardAdaptiveCardExtensionProps {
  title: string;
}

export interface INewsFeedCardAdaptiveCardExtensionState {
  news: ISearchResult[]|null,
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
    this.state = { news: null, totalNews: 0 };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    const sp = spfi().using(SPFx(this.context));

    const d = new Date(new Date().setDate(new Date().getDate() - 30).valueOf());

    sp.search(<ISearchQuery>{
      Querytext: `IsDocument:True AND FileExtension:aspx AND PromotedState:2 AND LastModifiedTime>=${d.toISOString()}`
    }).then((results) => {
      this.setState({ news: results.PrimarySearchResults, totalNews: results.TotalRows });
    });

    return Promise.resolve();
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
