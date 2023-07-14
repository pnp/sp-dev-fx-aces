import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { IApplyLeaveOofHolidayAdaptiveCardExtensionProps, IApplyLeaveOofHolidayAdaptiveCardExtensionState } from '../ApplyLeaveOofHolidayAdaptiveCardExtension';
export interface IHolidayConfigViewData {
    isEnabled: any;
}
export declare class HolidayConfigView extends BaseAdaptiveCardView<IApplyLeaveOofHolidayAdaptiveCardExtensionProps, IApplyLeaveOofHolidayAdaptiveCardExtensionState, IHolidayConfigViewData> {
    get data(): IHolidayConfigViewData;
    get template(): ISPFxAdaptiveCard;
    onAction(action: IActionArguments): Promise<void>;
}
//# sourceMappingURL=HolidayConfigView.d.ts.map