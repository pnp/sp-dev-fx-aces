import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';

import { Logger, LogLevel } from "@pnp/logging";

import { Video } from '../../../models/cg.models';
import { IVideocardAdaptiveCardExtensionProps, IVideocardAdaptiveCardExtensionState } from '../VideocardAdaptiveCardExtension';

export interface IQuickViewData {
  video: Video;
}

export class QuickView extends BaseAdaptiveCardView<
  IVideocardAdaptiveCardExtensionProps,
  IVideocardAdaptiveCardExtensionState,
  IQuickViewData
> {
  private LOG_SOURCE: string = "🔶 QuickView";
  public get data(): IQuickViewData {
    const video: Video = this.state.videos[this.state.currentIndex];
    return {
      video: video
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
          let idx = this.state.videos[this.state.currentIndex].id;
          let newViewId: number = this.state.currentIndex;
          idx--;
          if (idx < 0) {
            newViewId = this.state.videos[this.state.videos.length - 1].id;
          } else {
            newViewId = this.state.videos[idx].id;
          }
          this.setState({ currentIndex: newViewId });
        } else if (id === 'next') {
          let idx = this.state.videos[this.state.currentIndex].id;
          let newViewId: number = this.state.currentIndex;
          idx++;
          if (idx < this.state.videos.length) {
            newViewId = this.state.videos[idx].id;
          } else {
            newViewId = this.state.videos[0].id;
          }
          this.setState({ currentIndex: newViewId });
        }
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onAction) - ${err}`, LogLevel.Error);
    }
  }
}