import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'TodaysLunchAdaptiveCardExtensionStrings';
import { ILunch } from '../models/ILunch';
import { ITodaysLunchAdaptiveCardExtensionProps, ITodaysLunchAdaptiveCardExtensionState } from '../TodaysLunchAdaptiveCardExtension';

export interface IQuickViewData {
  subTitle: string;
  title: string;
  description: string;
}

export class QuickView extends BaseAdaptiveCardView<
  ITodaysLunchAdaptiveCardExtensionProps,
  ITodaysLunchAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    const lunch: ILunch = this.state.todaysLunch;
    return {
      subTitle: `Calories: ${lunch.calories}`,
      title: lunch.title,
      description: lunch.formattedDishes
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}