import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { IApplyLeaveOofHolidayAdaptiveCardExtensionProps, IApplyLeaveOofHolidayAdaptiveCardExtensionState } from '../ApplyLeaveOofHolidayAdaptiveCardExtension';
export interface IQuickViewData {
    isDateTrue?: boolean;
}
export declare class QuickView extends BaseAdaptiveCardView<IApplyLeaveOofHolidayAdaptiveCardExtensionProps, IApplyLeaveOofHolidayAdaptiveCardExtensionState, IQuickViewData> {
    get data(): IQuickViewData;
    get template(): ISPFxAdaptiveCard;
    onAction(action: IActionArguments): void;
}
//# sourceMappingURL=QuickView.d.ts.map