import { ISPFxAdaptiveCard, BaseAdaptiveCardQuickView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'RecentSalesAdaptiveCardExtensionStrings';
import QuickViewTemplate from './template/QuickViewTemplate.json';
import {
  IRecentSalesAdaptiveCardExtensionProps,
  IRecentSalesAdaptiveCardExtensionState
} from '../RecentSalesAdaptiveCardExtension';

export interface IQuickViewData {
  subTitle: string;
  title: string;
}

export class QuickView extends BaseAdaptiveCardQuickView<
  IRecentSalesAdaptiveCardExtensionProps,
  IRecentSalesAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      subTitle: strings.SubTitle,
      title: strings.Title
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return QuickViewTemplate as unknown as ISPFxAdaptiveCard;
  }
}
