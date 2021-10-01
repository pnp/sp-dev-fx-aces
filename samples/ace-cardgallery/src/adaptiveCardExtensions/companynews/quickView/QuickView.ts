import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'CompanynewsAdaptiveCardExtensionStrings';

import { Logger, LogLevel } from "@pnp/logging";

import { ICompanynewsAdaptiveCardExtensionProps, ICompanynewsAdaptiveCardExtensionState } from '../CompanynewsAdaptiveCardExtension';
import { LikedIcon, UnLikedIcon } from '../../../icons/cg.icons';
import { Article } from '../../../models/cg.models';
export interface IQuickViewData {
  article: Article;
  seeMoreLabel: string;
  likedIcon: string;
}

export class QuickView extends BaseAdaptiveCardView<
  ICompanynewsAdaptiveCardExtensionProps,
  ICompanynewsAdaptiveCardExtensionState,
  IQuickViewData
> {
  private LOG_SOURCE: string = "🔶 QuickView";
  public get data(): IQuickViewData {
    const article = this.state.articles[this.state.currentArticleId];

    let likedIcon: string = UnLikedIcon;
    if (article.liked) {
      likedIcon = LikedIcon;
    }

    return {
      article: article,
      seeMoreLabel: strings.SeeMoreLabel,
      likedIcon: likedIcon
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }

  public async onAction(action: IActionArguments): Promise<void> {
    try {

      if (action.type === 'Submit') {
        const { id, newIndex } = action.data;
        if (id === 'previous') {
          let idx = this.state.articles[this.state.currentArticleId].id;
          let newViewId: number = this.state.currentArticleId;
          idx--;
          if (idx < 0) {
            newViewId = this.state.articles[this.state.articles.length - 1].id;
          } else {
            newViewId = this.state.articles[idx].id;
          }
          this.setState({ currentArticleId: newViewId });
        } else if (id === 'next') {
          let idx = this.state.articles[this.state.currentArticleId].id;
          let newViewId: number = this.state.currentArticleId;
          idx++;
          if (idx < this.state.articles.length) {
            newViewId = this.state.articles[idx].id;
          } else {
            newViewId = this.state.articles[0].id;
          }
          this.setState({ currentArticleId: newViewId });
        } else if (id === 'like') {
          const { articles } = this.state;
          const item = articles[this.state.currentArticleId];
          if (item.liked) {
            item.liked = false;
          } else {
            item.liked = true;
          }
          this.setState({ articles: articles });
        }
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onAction) - ${err}`, LogLevel.Error);
    }
  }
}