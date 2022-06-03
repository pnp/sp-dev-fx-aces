import { BaseAdaptiveCardView, ISPFxAdaptiveCard } from '@microsoft/sp-adaptive-card-extension-base';
import { IFiles } from '../../../models';
import { IMyRecentFilesAdaptiveCardExtensionProps, IMyRecentFilesAdaptiveCardExtensionState } from '../MyRecentFilesAdaptiveCardExtension';
export interface IQuickViewData {
    title: string;
    files: IFiles[];
}
export declare class QuickView extends BaseAdaptiveCardView<IMyRecentFilesAdaptiveCardExtensionProps, IMyRecentFilesAdaptiveCardExtensionState, IQuickViewData> {
    get data(): IQuickViewData;
    get template(): ISPFxAdaptiveCard;
}
//# sourceMappingURL=QuickView.d.ts.map