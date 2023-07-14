import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { IApplyLeaveOofHolidayAdaptiveCardExtensionProps, IApplyLeaveOofHolidayAdaptiveCardExtensionState, ILeaveObject } from '../ApplyLeaveOofHolidayAdaptiveCardExtension';
export interface ISuccessViewData {
    leaveHistory: ILeaveObject[];
}
export declare class SuccessView extends BaseAdaptiveCardView<IApplyLeaveOofHolidayAdaptiveCardExtensionProps, IApplyLeaveOofHolidayAdaptiveCardExtensionState, ISuccessViewData> {
    get data(): ISuccessViewData;
    get template(): ISPFxAdaptiveCard;
}
//# sourceMappingURL=SuccessView.d.ts.map