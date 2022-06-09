import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'WordOfTheDayAdaptiveCardExtensionStrings';
import { WordOfTheDay } from '../model/WordOfTheDay';
import { IWordOfTheDayAdaptiveCardExtensionProps, IWordOfTheDayAdaptiveCardExtensionState } from '../WordOfTheDayAdaptiveCardExtension';

export interface IQuickViewData {
  subTitle: string;
  title: string;
  wordOfTheDay: WordOfTheDay;
  isError: boolean;
}

export class QuickView extends BaseAdaptiveCardView<
  IWordOfTheDayAdaptiveCardExtensionProps,
  IWordOfTheDayAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      subTitle: strings.SubTitle,
      title: strings.Title,
      wordOfTheDay: this.state.wordOfTheDay,
      isError: this.state.isError
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}