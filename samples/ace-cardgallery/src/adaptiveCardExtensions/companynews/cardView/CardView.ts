import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction
} from '@microsoft/sp-adaptive-card-extension-base';

import { Article } from '../../../models/cg.models';
import { ICompanynewsAdaptiveCardExtensionProps, ICompanynewsAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../CompanynewsAdaptiveCardExtension';

export class CardView extends BaseImageCardView<ICompanynewsAdaptiveCardExtensionProps, ICompanynewsAdaptiveCardExtensionState> {
  public get data(): IImageCardParameters {
    let article: Article = this.state.articles[0];

    return {
      primaryText: this.properties.description,
      imageUrl: article.imageSrc
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
