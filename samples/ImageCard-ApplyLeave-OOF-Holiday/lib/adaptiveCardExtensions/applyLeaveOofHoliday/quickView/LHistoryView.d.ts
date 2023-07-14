import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { IApplyLeaveOofHolidayAdaptiveCardExtensionProps, IApplyLeaveOofHolidayAdaptiveCardExtensionState, ILeaveObject } from '../ApplyLeaveOofHolidayAdaptiveCardExtension';
export interface ILHistoryViewData {
    leaveHistory: ILeaveObject[];
}
export declare class LHistoryView extends BaseAdaptiveCardView<IApplyLeaveOofHolidayAdaptiveCardExtensionProps, IApplyLeaveOofHolidayAdaptiveCardExtensionState, ILHistoryViewData> {
    get data(): ILHistoryViewData;
    get template(): ISPFxAdaptiveCard;
    onAction(action: IActionArguments): void;
}
//# sourceMappingURL=LHistoryView.d.ts.map