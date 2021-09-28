import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';

import { Logger, LogLevel } from "@pnp/logging";

import { Tweet } from '../../../models/cg.models';
import { ITwittercardAdaptiveCardExtensionProps, ITwittercardAdaptiveCardExtensionState } from '../TwittercardAdaptiveCardExtension';


export interface IQuickViewData {
  tweet: Tweet;
  date: string;
}

export class QuickView extends BaseAdaptiveCardView<
  ITwittercardAdaptiveCardExtensionProps,
  ITwittercardAdaptiveCardExtensionState,
  IQuickViewData
> {
  private LOG_SOURCE: string = "🔶 QuickView";
  public get data(): IQuickViewData {
    const tweet = this.state.tweets[this.state.currentTweetId];

    const date = new Date(tweet.date);
    return {
      tweet: tweet,
      date: new Date(tweet.date).toUTCString()
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
          let idx = this.state.tweets[this.state.currentTweetId].id;
          let newViewId: number = this.state.currentTweetId;
          idx--;
          if (idx < 0) {
            newViewId = this.state.tweets[this.state.tweets.length - 1].id;
          } else {
            newViewId = this.state.tweets[idx].id;
          }
          this.setState({ currentTweetId: newViewId });
        } else if (id === 'next') {
          let idx = this.state.tweets[this.state.currentTweetId].id;
          let newViewId: number = this.state.currentTweetId;
          idx++;
          if (idx < this.state.tweets.length) {
            newViewId = this.state.tweets[idx].id;
          } else {
            newViewId = this.state.tweets[0].id;
          }
          this.setState({ currentTweetId: newViewId });
        }
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onAction) - ${err}`, LogLevel.Error);
    }
  }
}