import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'VideocardAdaptiveCardExtensionStrings';
import { Video } from '../../../models/cg.models';
import { IVideocardAdaptiveCardExtensionProps, IVideocardAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../VideocardAdaptiveCardExtension';

export class CardView extends BaseImageCardView<IVideocardAdaptiveCardExtensionProps, IVideocardAdaptiveCardExtensionState> {


  public get data(): IImageCardParameters {
    const video: Video = this.state.videos[this.state.currentIndex];
    return {
      primaryText: video.title,
      imageUrl: video.thumbnailUrl
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'QuickView',
      parameters: {
        view: QUICK_VIEW_REGISTRY_ID
      }
    };
  }
}
