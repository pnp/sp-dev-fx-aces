import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IExternalLinkParameters } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'TodaysLunchAdaptiveCardExtensionStrings';
import { ILunch } from '../models/ILunch';
import { ITodaysLunchAdaptiveCardExtensionProps, ITodaysLunchAdaptiveCardExtensionState } from '../TodaysLunchAdaptiveCardExtension';

export interface IQuickViewData {
  subTitle: string;
  title: string;
  description: string;
  calories: string;
}

export class QuickView extends BaseAdaptiveCardView<
  ITodaysLunchAdaptiveCardExtensionProps,
  ITodaysLunchAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    const lunch: ILunch = this.state.todaysLunch;
    return {
      subTitle: lunch.shortDescription,
      title: lunch.title,
      description: lunch.formattedDishes,
      calories: `**Calories**: ${lunch.calories}`
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }

  public get externalLink(): IExternalLinkParameters | undefined {
    return {
      target: this.state.todaysLunch.seeMore
    };
  }
}