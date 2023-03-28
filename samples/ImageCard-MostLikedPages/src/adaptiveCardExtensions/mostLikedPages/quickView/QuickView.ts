import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { Page } from '../../types';
import { IMostLikedPagesAdaptiveCardExtensionProps, IMostLikedPagesAdaptiveCardExtensionState } from '../MostLikedPagesAdaptiveCardExtension';

export interface IQuickViewData {
  title: string;
  pages: Page[];
}

export class QuickView extends BaseAdaptiveCardView<
  IMostLikedPagesAdaptiveCardExtensionProps,
  IMostLikedPagesAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      title: this.properties.title,
      pages: this.state.pages
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }


}