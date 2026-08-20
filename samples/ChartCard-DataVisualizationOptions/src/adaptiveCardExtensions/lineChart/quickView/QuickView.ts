import { ISPFxAdaptiveCard, BaseAdaptiveCardQuickView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'LineChartAdaptiveCardExtensionStrings';
import template from './template/QuickViewTemplate.json';
import {
  ILineChartAdaptiveCardExtensionProps,
  ILineChartAdaptiveCardExtensionState
} from '../LineChartAdaptiveCardExtension';

export interface IQuickViewData {
  subTitle: string;
  title: string;
}

export class QuickView extends BaseAdaptiveCardQuickView<
  ILineChartAdaptiveCardExtensionProps,
  ILineChartAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      subTitle: strings.SubTitle,
      title: strings.Title
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return template as ISPFxAdaptiveCard;
  }
}
