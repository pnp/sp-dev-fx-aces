import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { ISearchResult } from '@pnp/sp/presets/all';
import * as strings from 'NewsFeedCardAdaptiveCardExtensionStrings';
import { INewsFeedCardAdaptiveCardExtensionProps, INewsFeedCardAdaptiveCardExtensionState } from '../NewsFeedCardAdaptiveCardExtension';

export interface IQuickViewData {
  news: ISearchResult[]|null;
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
    return require('./template/QuickViewTemplate.json');
  }
}