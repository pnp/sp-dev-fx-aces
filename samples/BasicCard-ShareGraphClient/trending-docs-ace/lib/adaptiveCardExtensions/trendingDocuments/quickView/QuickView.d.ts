import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { ITrendingDocumentsAdaptiveCardExtensionProps, ITrendingDocumentsAdaptiveCardExtensionState } from '../TrendingDocumentsAdaptiveCardExtension';
export interface IQuickViewData {
    subTitle: string;
    title: string;
}
export declare class QuickView extends BaseAdaptiveCardView<ITrendingDocumentsAdaptiveCardExtensionProps, ITrendingDocumentsAdaptiveCardExtensionState, IQuickViewData> {
    get data(): IQuickViewData;
    get template(): ISPFxAdaptiveCard;
}
//# sourceMappingURL=QuickView.d.ts.map