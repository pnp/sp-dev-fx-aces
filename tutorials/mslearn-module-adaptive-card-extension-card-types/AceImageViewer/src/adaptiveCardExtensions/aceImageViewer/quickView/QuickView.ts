import { ISPFxAdaptiveCard, BaseAdaptiveCardQuickView } from '@microsoft/sp-adaptive-card-extension-base';
import template from './template/QuickViewTemplate.json';
import {
  IAceImageViewerAdaptiveCardExtensionProps,
  IAceImageViewerAdaptiveCardExtensionState
} from '../AceImageViewerAdaptiveCardExtension';
import { INasaImage } from '../nasa.service';

export class QuickView extends BaseAdaptiveCardQuickView<
  IAceImageViewerAdaptiveCardExtensionProps,
  IAceImageViewerAdaptiveCardExtensionState,
  INasaImage
> {
  public get data(): INasaImage {
    return this.state.images[this.state.currentIndex];
  }

  public get template(): ISPFxAdaptiveCard {
    return template as ISPFxAdaptiveCard;
  }
}
