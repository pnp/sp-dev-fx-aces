import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { WordOfTheDay } from '../model/WordOfTheDay';
import { IWordOfTheDayAdaptiveCardExtensionProps, IWordOfTheDayAdaptiveCardExtensionState } from '../WordOfTheDayAdaptiveCardExtension';
export interface IQuickViewData {
    subTitle: string;
    title: string;
    wordOfTheDay: WordOfTheDay;
    isError: boolean;
}
export declare class QuickView extends BaseAdaptiveCardView<IWordOfTheDayAdaptiveCardExtensionProps, IWordOfTheDayAdaptiveCardExtensionState, IQuickViewData> {
    get data(): IQuickViewData;
    get template(): ISPFxAdaptiveCard;
}
//# sourceMappingURL=QuickView.d.ts.map