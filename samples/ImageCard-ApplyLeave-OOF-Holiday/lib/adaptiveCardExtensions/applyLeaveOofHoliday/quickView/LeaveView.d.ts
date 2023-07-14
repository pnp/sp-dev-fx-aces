import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { GraphService } from '../../../services/GraphService';
import { IApplyLeaveOofHolidayAdaptiveCardExtensionProps, IApplyLeaveOofHolidayAdaptiveCardExtensionState } from '../ApplyLeaveOofHolidayAdaptiveCardExtension';
export interface ILeaveViewData {
    leaveType: string;
    startDate: Date;
    endDate: Date;
    leaveDesc: string;
    isOOFEnabled: boolean;
    oofMessage: string;
    uploadIcon: string;
    errOnSubmit?: boolean;
}
export declare class LeaveView extends BaseAdaptiveCardView<IApplyLeaveOofHolidayAdaptiveCardExtensionProps, IApplyLeaveOofHolidayAdaptiveCardExtensionState, ILeaveViewData> {
    _graphService: GraphService;
    get data(): ILeaveViewData;
    get template(): ISPFxAdaptiveCard;
    onAction(action: IActionArguments): Promise<void>;
}
//# sourceMappingURL=LeaveView.d.ts.map