import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction
} from '@microsoft/sp-adaptive-card-extension-base';

import { IImageRotatorAdaptiveCardExtensionProps, IImageRotatorAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../ImageRotatorAdaptiveCardExtension';
import { Image } from '../../../models/cg.models';


export class CardView extends BaseImageCardView<IImageRotatorAdaptiveCardExtensionProps, IImageRotatorAdaptiveCardExtensionState> {

  public get data(): IImageCardParameters {
    const image: Image = this.state.images[this.state.currentImageId];

    return {
      primaryText: this.properties.description,
      imageUrl: image.imageSrc,
      iconAltText: image.altText
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
