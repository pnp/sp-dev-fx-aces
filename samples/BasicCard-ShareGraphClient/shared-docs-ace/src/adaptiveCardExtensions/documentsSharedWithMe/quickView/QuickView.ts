import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'DocumentsSharedWithMeAdaptiveCardExtensionStrings';
import { IDocumentsSharedWithMeAdaptiveCardExtensionProps, IDocumentsSharedWithMeAdaptiveCardExtensionState } from '../DocumentsSharedWithMeAdaptiveCardExtension';

export interface IQuickViewData {
  subTitle: string;
  title: string;
}

export class QuickView extends BaseAdaptiveCardView<
  IDocumentsSharedWithMeAdaptiveCardExtensionProps,
  IDocumentsSharedWithMeAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      subTitle: strings.SubTitle,
      title: strings.Title
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}