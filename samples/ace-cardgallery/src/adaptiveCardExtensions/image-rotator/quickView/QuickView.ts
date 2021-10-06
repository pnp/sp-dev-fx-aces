import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';

import { IImageRotatorAdaptiveCardExtensionProps, IImageRotatorAdaptiveCardExtensionState } from '../ImageRotatorAdaptiveCardExtension';

import { Logger, LogLevel } from "@pnp/logging";

import { Image } from '../../../models/cg.models';

export interface IQuickViewData {
  image: Image;
}

export class QuickView extends BaseAdaptiveCardView<
  IImageRotatorAdaptiveCardExtensionProps,
  IImageRotatorAdaptiveCardExtensionState,
  IQuickViewData
> {
  private LOG_SOURCE: string = "🔶 QuickView";
  public get data(): IQuickViewData {
    const image = this.state.images[this.state.currentImageId];
    return {
      image: image
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
          let idx = this.state.images[this.state.currentImageId].id;
          let newViewId: number = this.state.currentImageId;
          idx--;
          if (idx < 0) {
            newViewId = this.state.images[this.state.images.length - 1].id;
          } else {
            newViewId = this.state.images[idx].id;
          }
          this.setState({ currentImageId: newViewId });
        } else if (id === 'next') {
          let idx = this.state.images[this.state.currentImageId].id;
          let newViewId: number = this.state.currentImageId;
          idx++;
          if (idx < this.state.images.length) {
            newViewId = this.state.images[idx].id;
          } else {
            newViewId = this.state.images[0].id;
          }
          this.setState({ currentImageId: newViewId });
        }
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onAction) - ${err}`, LogLevel.Error);
    }
  }
}