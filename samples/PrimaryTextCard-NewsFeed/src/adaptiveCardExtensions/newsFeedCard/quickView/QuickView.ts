import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { ISearchResult } from '@pnp/sp/search';
import { INewsFeedCardAdaptiveCardExtensionProps, INewsFeedCardAdaptiveCardExtensionState } from '../NewsFeedCardAdaptiveCardExtension';

export interface IQuickViewData {
  news: ISearchResult[]|undefined;
}

export class QuickView extends BaseAdaptiveCardView<
  INewsFeedCardAdaptiveCardExtensionProps,
  INewsFeedCardAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      news: this.state.news
    };
  }

  public get template(): ISPFxAdaptiveCard {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('./template/QuickViewTemplate.json');
  }
}