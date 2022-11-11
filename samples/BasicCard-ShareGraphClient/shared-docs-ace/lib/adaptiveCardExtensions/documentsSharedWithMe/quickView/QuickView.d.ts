import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { IDocumentsSharedWithMeAdaptiveCardExtensionProps, IDocumentsSharedWithMeAdaptiveCardExtensionState } from '../DocumentsSharedWithMeAdaptiveCardExtension';
export interface IQuickViewData {
    subTitle: string;
    title: string;
}
export declare class QuickView extends BaseAdaptiveCardView<IDocumentsSharedWithMeAdaptiveCardExtensionProps, IDocumentsSharedWithMeAdaptiveCardExtensionState, IQuickViewData> {
    get data(): IQuickViewData;
    get template(): ISPFxAdaptiveCard;
}
//# sourceMappingURL=QuickView.d.ts.map