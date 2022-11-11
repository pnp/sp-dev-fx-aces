import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { IStockBitcoinFeedAdaptiveCardExtensionProps, IStockBitcoinFeedAdaptiveCardExtensionState } from '../StockBitcoinFeedAdaptiveCardExtension';
export interface IQuickViewData {
    subTitle: string;
    title: string;
}
export declare class QuickView extends BaseAdaptiveCardView<IStockBitcoinFeedAdaptiveCardExtensionProps, IStockBitcoinFeedAdaptiveCardExtensionState, IQuickViewData> {
    get data(): IQuickViewData;
    get template(): ISPFxAdaptiveCard;
}
//# sourceMappingURL=QuickView.d.ts.map